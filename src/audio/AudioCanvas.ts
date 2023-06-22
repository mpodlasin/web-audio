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

/* Initialized */

export interface CustomAudioNode {
	connect(destination: CustomAudioNode | AudioParam): void;
	disconnect(desination: CustomAudioNode | AudioParam): void;
}

export interface CustomAudioScheduledSourceNode extends CustomAudioNode {
	start(): void;
	stop(): void;
}

export interface CustomAudioNodeWithWebApiNode<T extends AudioNode = AudioNode> extends CustomAudioNode {
	readonly webApiNode: T;
}

export function isCustomAudioNodeWithWebApiNode(
	customAudioNode: CustomAudioNode
): customAudioNode is CustomAudioNodeWithWebApiNode {
	return 'webApiNode' in customAudioNode;
}

export class GenericCustomAudioNodeWithWebApiNode<T extends AudioNode> implements CustomAudioNodeWithWebApiNode<T> {
	readonly webApiNode: T;
	private desinations: CustomAudioNode[] = [];

	constructor(webApiNode: T) {
		this.webApiNode = webApiNode;
	}

	connect(destination: CustomAudioNode | AudioParam): void {
		if (destination instanceof AudioParam) {
			this.webApiNode.connect(destination);
			return;
		}

		if (isCustomAudioNodeWithWebApiNode(destination)) {
			this.webApiNode.connect(destination.webApiNode);
		}

		this.desinations.push(destination);
	}

	disconnect(destination: CustomAudioNode | AudioParam): void {
		if (destination instanceof AudioParam) {
			this.webApiNode.disconnect(destination);
			return;
		}

		if (isCustomAudioNodeWithWebApiNode(destination)) {
			this.webApiNode.disconnect(destination.webApiNode);
		}

		this.desinations = this.desinations.filter((d) => d !== destination);
	}
}

export class CustomAudioNodeWithWebApiAudioScheduledSourceNode<T extends AudioScheduledSourceNode> extends GenericCustomAudioNodeWithWebApiNode<T> implements CustomAudioScheduledSourceNode {
	start(): void {
		this.webApiNode.start();
	}

	stop(): void {
		this.webApiNode.stop();
	}
}

export class CustomOscillatorNode extends CustomAudioNodeWithWebApiAudioScheduledSourceNode<OscillatorNode> {
	constructor() {
		super(globalContext.createOscillator());
	}
}

export class CustomGainNode extends GenericCustomAudioNodeWithWebApiNode<GainNode> {
	constructor() {
		super(globalContext.createGain());
	}
}

export class DestinationNode extends GenericCustomAudioNodeWithWebApiNode<AudioDestinationNode> {
	constructor() {
		super(globalContext.destination);
	}
}

export type AudioNodeDatabase = {
	[key: string]: CustomAudioNode;
};

/* FUNCTIONS */

export function createAudioCanvas(
	audioElements: SerializedAudioElements,
	audioNodeDatabase: AudioNodeDatabase
): void {
	const audioElementsWithIds = addIdsToAudioElements(audioElements);

	Object.entries(audioElementsWithIds).forEach(([id, audioElement]) => {
		const createdAudioNode = createCustomAudioNode(audioElement);

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
			const audioNode = audioNodeDatabase[id] as CustomOscillatorNode;

			if (audioNode !== undefined) {
				audioNode.webApiNode.type = audioElement.oscillatorType;
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

function createCustomAudioNode(
	audioElement: SerializedAudioElement<string, string>
): CustomAudioNode | null {
	switch (audioElement.type) {
		case 'oscillator':
			return new CustomOscillatorNode();
		case 'gain':
			return new CustomGainNode();
		case 'destination':
			return new DestinationNode();
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
	audioNode: CustomAudioNode,
	parameterName: string
): AudioParam {
	if (audioNode instanceof CustomOscillatorNode) {
		switch (parameterName) {
			case 'frequency':
				return audioNode.webApiNode.frequency;
			case 'detune':
				return audioNode.webApiNode.detune;
		}
	}

	if (audioNode instanceof CustomGainNode) {
		switch (parameterName) {
			case 'gain':
				return audioNode.webApiNode.gain;
		}
	}

	throw new Error(`Parameter ${parameterName} not found`);
}

function isSerializedOscillatorNode(
	serializedAudioElement: SerializedAudioElement<string, string>
): serializedAudioElement is SerializedOscillatorNode {
	return serializedAudioElement.type === 'oscillator';
}
