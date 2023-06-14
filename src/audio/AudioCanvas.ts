/* eslint-disable @typescript-eslint/no-explicit-any */
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

export type SerializedOscillatorNode = SerializedAudioElement<'oscillator', 'frequency' | 'detune'>;

export type SerializedGainNode = SerializedAudioElement<'gain', 'gain'>;

/* WEB AUDIO API */

export type AudioNodeDatabase = {
	[key: string]: AudioNode;
};

/* FUNCTIONS */

export function createAudioCanvas(
	audioElements: SerializedAudioElements,
	audioNodeDatabase: AudioNodeDatabase
): void {
	const audioElementsWithIds = addIdsToAudioElements(audioElements);

	for (const id in audioElementsWithIds) {
		audioNodeDatabase[id] = createAudioNode(audioElements[id]);
	}

	for (const id in audioElementsWithIds) {
		const audioElementA = audioElementsWithIds[id];

		if (audioElementA.inputs) {
			for (const inputId of audioElementA.inputs) {
				const audioElementB = audioElementsWithIds[inputId];

				connectAudioElements(audioElementB, audioElementA, audioNodeDatabase);
			}
		}
	}

	for (const id in audioElementsWithIds) {
		const audioElement = audioElementsWithIds[id];

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
	}
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
			const audioNodeB = audioNodeDatabase[audioElementB.id];

			audioNodeB.connect((audioNodeA as any)[parameterName]);
		}
	} else if (typeof parameterValue === 'number') {
		(audioNodeA as any)[parameterName].value = parameterValue;
	}
}

function connectAudioElements(
	audioElementA: SerializedAudioElementWithId<string, string>,
	audioElementB: SerializedAudioElementWithId<string, string>,
	audioNodeDatabase: AudioNodeDatabase
): void {
	const audioNodeA = audioNodeDatabase[audioElementA.id];
	const audioNodeB = audioNodeDatabase[audioElementB.id];

	audioNodeA.connect(audioNodeB);
}

function createAudioNode(audioElement: SerializedAudioElement<string, string>): AudioNode {
	switch (audioElement.type) {
		case 'oscillator':
			return globalContext.createOscillator();
		case 'gain':
			return globalContext.createGain();
		default:
			throw new Error(`Unknown audio element type: ${audioElement.type}`);
	}
}

function addIdsToAudioElements(
	audioElements: SerializedAudioElements
): SerializedAudioElementsWithIds {
	const audioElementsWithIds: SerializedAudioElementsWithIds = {};

	for (const id in audioElements) {
		audioElementsWithIds[id] = { ...audioElements[id], id };
	}

	return audioElementsWithIds;
}
