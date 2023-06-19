import { globalContext } from './GlobalContext';

/* SERIALIZED */

export type SerializedAudioElements = {
	[key: string]: SerializedAudioElement<string, string>;
};

export type SerializedAudioElementsWithIds = {
	[key: string]: SerializedAudioElementWithId<string, string>;
};

export type SerializedAudioElement<T extends string, P extends string> = {
	type: T;
	inputs?: string[];
	parameters?: {
		[key in P]: SerializedAudioParameter;
	};
};

export type SerializedAudioElementWithId<
	T extends string,
	P extends string
> = SerializedAudioElement<T, P> & {
	id: string;
};

export type SerializedAudioParameter = number | string[]; /* value or ids of connected inputs */

export type SerializedOscillatorNode = SerializedAudioElement<'oscillator', 'frequency' | 'detune'> & {
	oscillatorType: OscillatorType;
}

export type SerializedGainNode = SerializedAudioElement<'gain', 'gain'>;

export type AudioNodeDatabase = {
	[key: string]: AudioNode;
};

/* FUNCTIONS */

export function createAudioCanvas(
	audioElements: SerializedAudioElements,
	audioNodeDatabase: AudioNodeDatabase
): void {
	const audioElementsWithIds = addIdsToAudioElements(audioElements);

	Object.entries(audioElementsWithIds).forEach(([id, audioElement]) => {
		const createdAudioNode = createAudioNode(audioElement);

		if (createdAudioNode !== null) {
			audioNodeDatabase[id] = createdAudioNode;
		}
	});

	Object.values(audioElementsWithIds).forEach((audioElementA) => {

		if (audioElementA.inputs) {
			for (const inputId of audioElementA.inputs) {
				const audioElementB = audioElementsWithIds[inputId];

				if (audioElementB === undefined) {
					throw new Error(`Audio element with id ${inputId} not found`);
				}

				connectAudioElements(audioElementB, audioElementA, audioNodeDatabase);
			}
		}
	});

	Object.values(audioElementsWithIds).forEach((audioElement) => {
		if (audioElement.parameters) {
			for (const parameterName in audioElement.parameters) {
				connectAudioElementsToParameter(
					audioElement,
					audioElementsWithIds,
					parameterName,
					audioNodeDatabase
				);
			}
		}
	})

	Object.entries(audioElementsWithIds).forEach(([id, audioElement]) => {
		if (isSerializedOscillatorNode(audioElement)) {
			const audioNode = audioNodeDatabase[id] as OscillatorNode;

			if (audioNode !== undefined) {
				audioNode.type = audioElement.oscillatorType;
			}
		}
	});
}

function connectAudioElementsToParameter(
	audioElementA: SerializedAudioElementWithId<string, string>,
	audioElementsWithIds: SerializedAudioElementsWithIds,
	parameterName: string,
	audioNodeDatabase: AudioNodeDatabase
): void {
	const audioNodeA = audioNodeDatabase[audioElementA.id];
	const parameterValue = audioElementA.parameters?.[parameterName];

	if (Array.isArray(parameterValue)) {
		for (const inputId of parameterValue) {
			const audioElementB = audioElementsWithIds[inputId];

			if (audioElementB === undefined) {
				throw new Error(`Audio element with id ${inputId} not found`);
			}

			const audioNodeB = audioNodeDatabase[audioElementB.id];

			if (audioNodeA !== undefined && audioNodeB !== undefined) {
				audioNodeB.connect(accessParameter(audioNodeA, parameterName));
			}
		}
	} else if (typeof parameterValue === 'number' && audioNodeA !== undefined) {
		accessParameter(audioNodeA, parameterName).value = parameterValue;
	}
}

export function playAudioCanvas(audioNodeDatabase: AudioNodeDatabase): void {
	for (const id in audioNodeDatabase) {
		const audioNode = audioNodeDatabase[id];

		if (audioNode instanceof AudioScheduledSourceNode) {
			audioNode.start();
		}
	}
}

function connectAudioElements(
	audioElementA: SerializedAudioElementWithId<string, string>,
	audioElementB: SerializedAudioElementWithId<string, string>,
	audioNodeDatabase: AudioNodeDatabase
): void {
	const audioNodeA = audioNodeDatabase[audioElementA.id];
	const audioNodeB = audioNodeDatabase[audioElementB.id];

	if (audioNodeA !== undefined && audioNodeB !== undefined) {
		audioNodeA.connect(audioNodeB);
	}
}

function createAudioNode(audioElement: SerializedAudioElement<string, string>): AudioNode | null {
	switch (audioElement.type) {
		case 'oscillator':
			return globalContext.createOscillator();
		case 'gain':
			return globalContext.createGain();
		case 'destination':
			return globalContext.destination;
		default:
			return null;
	}
}

function addIdsToAudioElements(
	audioElements: SerializedAudioElements
): SerializedAudioElementsWithIds {
	const audioElementsWithIds: SerializedAudioElementsWithIds = {};

	Object.entries(audioElements).forEach(([id, audioElement]) => {
		audioElementsWithIds[id] = { ...audioElement, id };
	});

	return audioElementsWithIds;
}

function accessParameter(
	audioNode: AudioNode,
	parameterName: string
): AudioParam {
	if (audioNode instanceof OscillatorNode) {
		if (parameterName === 'frequency') {
			return audioNode.frequency;
		}

		if (parameterName === 'detune') {
			return audioNode.detune;
		}

		throw new Error(`Parameter ${parameterName} not found on OscillatorNode`);
	}

	if (audioNode instanceof GainNode) {
		if (parameterName === 'gain') {
			return audioNode.gain;
		}

		throw new Error(`Parameter ${parameterName} not found on GainNode`);
	}

	throw new Error(`Parameter ${parameterName} not found on AudioNode`);
}

function isSerializedOscillatorNode(
	serializedAudioElement: SerializedAudioElement<string, string>
): serializedAudioElement is SerializedOscillatorNode {
	return serializedAudioElement.type === 'oscillator';
}
