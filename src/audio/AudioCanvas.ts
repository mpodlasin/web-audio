/* eslint-disable @typescript-eslint/no-explicit-any */
import { globalContext } from './GlobalContext';

export type SerializedAudioCanvas = SerializedAudioGraph[];

export interface SerializedAudioGraph {
	id: string;
}

export interface AudioNodeWithInputs {
	id: string;
	type: string;
	audioNode: AudioNode;
	inputs: AudioNodeWithInputs[];
	parameterInputs: {
		[parameterName: string]: AudioNodeWithInputs[];
	};
}

export interface AudioNodeDatabase {
	[id: string]: AudioNode;
}

export interface AudioElements {
	[id: string]: AudioElement;
}

export type AudioElement = SerializedOscillator | SerializedGain | SerializedDestination;

export type AudioElementWithInputs = SerializedGain | SerializedDestination;

export function isAudioElementWithInputs(
	audioElement: AudioElement
): audioElement is AudioElementWithInputs {
	return audioElement.type === 'gain' || audioElement.type === 'destination';
}

export type SerializedAudioParam = number | { inputs: SerializedAudioGraph[] };

export interface SerializedAudioNode<T extends string, P extends string> {
	type: T;
	parameters: {
		[parameterName in P]: SerializedAudioParam;
	};
}

export interface SerializedAudioNodeWithInputs<T extends string, P extends string>
	extends SerializedAudioNode<T, P> {
	inputs: SerializedAudioGraph[];
}

export type SerializedOscillator = SerializedAudioNode<'oscillator', 'frequency'> & {
	oscillatorType: OscillatorType;
};

export type SerializedGain = SerializedAudioNodeWithInputs<'gain', 'gain'>;

export type SerializedDestination = SerializedAudioNodeWithInputs<'destination', never>;

export function createAudioCanvas(
	serializedAudioCanvas: SerializedAudioCanvas,
	audioElements: AudioElements,
	audioNodeDatabase: AudioNodeDatabase
): AudioNodeWithInputs[] {
	return serializedAudioCanvas.map((serializedAudioGraph) =>
		createAudioGraph(serializedAudioGraph, audioElements, audioNodeDatabase)
	);
}

function createParameterInputs<P extends string>(
	audioNode: any,
	audioElement: SerializedAudioNode<any, P>,
	paramterName: P,
	audioElements: AudioElements,
	audioNodeDatabase: AudioNodeDatabase
): AudioNodeWithInputs[] {
	const parameter = audioElement.parameters[paramterName];

	if (typeof parameter === 'number') {
		return [];
	}
	const oscillatorNodeInputs = createAudioCanvas(
		parameter.inputs,
		audioElements,
		audioNodeDatabase
	);
	oscillatorNodeInputs.forEach((input) => {
		input.audioNode.connect(audioNode[paramterName]);
	});
	return oscillatorNodeInputs;
}

export function createAudioGraph(
	serializedAudioGraph: SerializedAudioGraph,
	audioElements: AudioElements,
	audioNodeDatabase: AudioNodeDatabase
): AudioNodeWithInputs {
	const audioElement = audioElements[serializedAudioGraph.id];

	if (!audioElement) {
		throw new Error(`Audio element with id ${serializedAudioGraph.id} not found`);
	}

	let audioNode: AudioNode | undefined;
	const parameterInputs: {
		[parameterName: string]: AudioNodeWithInputs[];
	} = {};

	if (audioNodeDatabase[serializedAudioGraph.id]) {
		audioNode = audioNodeDatabase[serializedAudioGraph.id];
	} else {
		switch (audioElement.type) {
			case 'oscillator':
				audioNode = createOscillator(audioElement);
				parameterInputs.frequency = createParameterInputs(
					audioNode,
					audioElement,
					'frequency',
					audioElements,
					audioNodeDatabase
				);
				break;
			case 'gain':
				audioNode = createGain(audioElement);
				parameterInputs.gain = createParameterInputs(
					audioNode,
					audioElement,
					'gain',
					audioElements,
					audioNodeDatabase
				);
				break;
			case 'destination':
				audioNode = createDestination();
				break;
		}

		audioNodeDatabase[serializedAudioGraph.id] = audioNode;
	}

	if (audioNode === undefined) {
		throw new Error(`Audio node with id ${serializedAudioGraph.id} could not be created`);
	}

	const inputs = isAudioElementWithInputs(audioElement)
		? createAudioCanvas(audioElement.inputs, audioElements, audioNodeDatabase)
		: [];

	for (const input of inputs) {
		input.audioNode.connect(audioNode);
	}

	const audioNodeWithInputs: AudioNodeWithInputs = {
		id: serializedAudioGraph.id,
		type: audioElement.type,
		audioNode,
		inputs,
		parameterInputs
	};

	return audioNodeWithInputs;
}

function createOscillator(serializedOscillator: SerializedOscillator): OscillatorNode {
	const oscillatorNode = globalContext.createOscillator();
	oscillatorNode.type = serializedOscillator.oscillatorType;
	if (typeof serializedOscillator.parameters.frequency === 'number') {
		oscillatorNode.frequency.value = serializedOscillator.parameters.frequency;
	}
	return oscillatorNode;
}

function createGain(serializedGain: SerializedGain): GainNode {
	const gainNode = globalContext.createGain();
	if (typeof serializedGain.parameters.gain === 'number') {
		gainNode.gain.value = serializedGain.parameters.gain;
	}
	return gainNode;
}

function createDestination(): AudioDestinationNode {
	return globalContext.destination;
}

export function updateAudioCanvas(
	updatedSerializedAudioCanvas: SerializedAudioCanvas,
	updatedAudioElements: AudioElements,
	audioNodeDatabase: AudioNodeDatabase,
	audioNodesWithInputs: AudioNodeWithInputs[]
): AudioNodeWithInputs[] {
	return updatedSerializedAudioCanvas.map((updatedSerializedAudioGraph, index) =>
		updateAudioGraph(
			updatedSerializedAudioGraph,
			updatedAudioElements,
			audioNodeDatabase,
			audioNodesWithInputs[index]
		)
	);
}

export function updateAudioGraph(
	updatedSerializedAudioGraph: SerializedAudioGraph,
	updatedAudioElements: AudioElements,
	audioNodeDatabase: AudioNodeDatabase,
	audioNodeWithInputs?: AudioNodeWithInputs
): AudioNodeWithInputs {
	const updatedAudioElement = updatedAudioElements[updatedSerializedAudioGraph.id];

	if (!updatedAudioElement) {
		throw new Error(`Audio element with id ${updatedSerializedAudioGraph.id} not found`);
	}

	if (!audioNodeWithInputs || updatedAudioElement.type !== audioNodeWithInputs.type) {
		return createAudioGraph(updatedSerializedAudioGraph, updatedAudioElements, audioNodeDatabase);
	}

	switch (updatedAudioElement.type) {
		case 'oscillator':
			updateOscillator(updatedAudioElement, audioNodeWithInputs.audioNode as OscillatorNode);
			break;
		case 'gain':
			updateGain(updatedAudioElement, audioNodeWithInputs.audioNode as GainNode);
			break;
		case 'destination':
			updateDestination();
			break;
	}

	const updatedInputs = isAudioElementWithInputs(updatedAudioElement)
		? updateAudioCanvas(
				updatedAudioElement.inputs,
				updatedAudioElements,
				audioNodeDatabase,
				audioNodeWithInputs.inputs
		  )
		: [];

	for (const input of updatedInputs) {
		input.audioNode.connect(audioNodeWithInputs.audioNode);
	}

	for (const input of audioNodeWithInputs.inputs) {
		if (!updatedInputs.includes(input)) {
			input.audioNode.disconnect(audioNodeWithInputs.audioNode);
		}
	}

	return {
		...audioNodeWithInputs,
		inputs: updatedInputs
	};
}

function updateOscillator(
	serializedOscillator: SerializedOscillator,
	oscillatorNode: OscillatorNode
): OscillatorNode {
	oscillatorNode.type = serializedOscillator.oscillatorType;
	if (typeof serializedOscillator.parameters.frequency === 'number') {
		oscillatorNode.frequency.value = serializedOscillator.parameters.frequency;
	}
	return oscillatorNode;
}

function updateGain(serializedGain: SerializedGain, gainNode: GainNode): GainNode {
	if (typeof serializedGain.parameters.gain === 'number') {
		gainNode.gain.value = serializedGain.parameters.gain;
	}
	return gainNode;
}

function updateDestination(): AudioDestinationNode {
	return globalContext.destination;
}
