import {
	allowedSerializedAudioElementStaticDefinitions,
	type AllowedSerializedAudioElements,
	type SerializedAudioElementWithId,
	type SerializedAudioElementsWithIds,
	type SerializedAudioElement,
	type SerializedOscillatorNode,
	type SerializedSequencerNode,
	type SerializedAudioElements,
	type Inputs
} from '../serialized';
import {
	CustomGainNode,
	CustomOscillatorNode,
	CustomOscilloscopeNode,
	DestinationNode,
	EnvelopeNode,
	MidiNode,
	SequencerNode,
	TriggerNode
} from './nodes';
import {
	isCustomAudioScheduledSourceNode,
	type CustomAudioNode,
	isCustomAudioNodeWithWebApiNode,
	type AudioNodeDatabase
} from './types';

export const updateAudioCanvas = (
	newAudioElements: SerializedAudioElements,
	oldAudioElements: SerializedAudioElements,
	audioNodeDatabase: AudioNodeDatabase
) => {
	/* remove deleted nodes */
	Object.entries(oldAudioElements).forEach(([id]) => {
		const newAudioElement = newAudioElements[id];

		if (newAudioElement === undefined) {
			const node = audioNodeDatabase[id];
			if (node !== undefined) {
				if (isCustomAudioScheduledSourceNode(node)) {
					try {
						node.stop();
					} catch {
						/* Do nothing */
					}
				}

				if (isCustomAudioNodeWithWebApiNode(node)) {
					node.webApiNode.disconnect();
				}
			}

			delete audioNodeDatabase[id];
		}
	});

	/* add new nodes */

	Object.entries(newAudioElements).forEach(([id, newAudioElement]) => {
		const oldAudioElement = oldAudioElements[id];

		if (oldAudioElement === undefined) {
			const createdAudioNode = createCustomAudioNode(newAudioElement);

			if (createdAudioNode !== null) {
				audioNodeDatabase[id] = createdAudioNode;
			}
		}
	});

	/* add connections to inputs */

	Object.entries(newAudioElements).forEach(([id, newAudioElement]) => {
		const oldAudioElement = oldAudioElements[id];

		if (oldAudioElement === undefined) {
			findInputsAndConnectAudioElements(
				{
					...newAudioElement,
					id
				},
				addIdsToAudioElements(newAudioElements),
				audioNodeDatabase
			);
		} else {
			const addedInputs = getAddedInputs(newAudioElement, oldAudioElement);

			addedInputs.forEach((input) => {
				const inputId = typeof input === 'string' ? input : input.id;
				const output = typeof input === 'string' ? undefined : input.output;

				const audioElementB = newAudioElements[inputId];

				if (audioElementB === undefined) {
					throw new Error(`Audio element with id ${inputId} not found`);
				}

				connectAudioElements(
					{
						...audioElementB,
						id: inputId
					},
					{
						...newAudioElement,
						id
					},
					audioNodeDatabase,
					output
				);
			});
		}
	});

	/* add connections to parameters */
	Object.entries(newAudioElements).forEach(([id, newAudioElement]) => {
		const oldAudioElement = oldAudioElements[id];

		if (oldAudioElement === undefined) {
			connectAudioElementsToParameters(
				{
					...newAudioElement,
					id
				},
				addIdsToAudioElements(newAudioElements),
				audioNodeDatabase
			);
		} else {
			const changedParametersWithConnections = getChangedParameters(
				newAudioElement,
				oldAudioElement
			);

			changedParametersWithConnections.forEach((parameterName) => {
				connectAudioElementsToParameter(
					{
						...newAudioElement,
						id
					},
					addIdsToAudioElements(newAudioElements),
					parameterName,
					audioNodeDatabase
				);
			});
		}
	});

	/* removes connections to inputs */

	Object.entries(newAudioElements).forEach(([id, newAudioElement]) => {
		const oldAudioElement = oldAudioElements[id];

		if (!oldAudioElement) return;

		const removedInputs = getRemovedInputs(newAudioElement, oldAudioElement);

		removedInputs.forEach((input) => {
			const inputId = typeof input === 'string' ? input : input.id;
			const output = typeof input === 'string' ? undefined : input.output;

			const audioElementB = newAudioElements[inputId];

			if (audioElementB === undefined) {
				throw new Error(`Audio element with id ${inputId} not found`);
			}

			disconnectAudioElements(
				{
					...audioElementB,
					id: inputId
				},
				{
					...newAudioElement,
					id
				},
				audioNodeDatabase,
				output
			);
		});
	});

	/* removes connections to parameters */
	Object.entries(newAudioElements).forEach(([id, newAudioElement]) => {
		const oldAudioElement = oldAudioElements[id];

		if (oldAudioElement === undefined) return;

		const removedInputs = getRemovedParameterInputs(newAudioElement, oldAudioElement);

		removedInputs.forEach(([parameterName, nodeId]) => {
			const audioElementNode = audioNodeDatabase[id];
			const removedInputNode = audioNodeDatabase[nodeId];

			if (removedInputNode && audioElementNode) {
				removedInputNode.disconnect(accessParameter(audioElementNode, parameterName));
			}
		});
	});
};

function connectAudioElementsToParameters(
	audioElementA: SerializedAudioElementWithId<AllowedSerializedAudioElements['type'], string>,
	audioElementsWithIds: SerializedAudioElementsWithIds,
	audioNodeDatabase: AudioNodeDatabase
): void {
	if (audioElementA.parameters) {
		for (const parameterName in audioElementA.parameters) {
			connectAudioElementsToParameter(
				audioElementA,
				audioElementsWithIds,
				parameterName,
				audioNodeDatabase
			);
		}
	}
}

function connectAudioElementsToParameter(
	audioElementA: SerializedAudioElementWithId<AllowedSerializedAudioElements['type'], string>,
	audioElementsWithIds: SerializedAudioElementsWithIds,
	parameterName: string,
	audioNodeDatabase: AudioNodeDatabase
): void {
	const audioNodeA = audioNodeDatabase[audioElementA.id];
	const parameterValue = audioElementA.parameters?.[parameterName];

	if (Array.isArray(parameterValue)) {
		for (const input of parameterValue) {
			const inputId = typeof input === 'string' ? input : input.id;
			const output = typeof input === 'string' ? undefined : input.output;
			const audioElementB = audioElementsWithIds[inputId];

			if (audioElementB === undefined) {
				throw new Error(`Audio element with id ${inputId} not found`);
			}

			const staticDefinitionAudioElementB =
				allowedSerializedAudioElementStaticDefinitions[audioElementB.type];

			const audioNodeB = audioNodeDatabase[audioElementB.id];

			if (audioNodeA !== undefined && audioNodeB !== undefined) {
				audioNodeB.connect(
					accessParameter(audioNodeA, parameterName),
					output ?? staticDefinitionAudioElementB.outputs[0]
				);
			}
		}
	} else if (typeof parameterValue === 'number' && audioNodeA !== undefined) {
		accessParameter(audioNodeA, parameterName).value = parameterValue;
	}
}

export function playAudioCanvas(audioNodeDatabase: AudioNodeDatabase): void {
	for (const id in audioNodeDatabase) {
		const audioNode = audioNodeDatabase[id];

		if (audioNode === undefined) {
			throw new Error(`Audio node with id ${id} not found`);
		}

		if (isCustomAudioScheduledSourceNode(audioNode)) {
			audioNode.start();
		}
	}
}

function findInputsAndConnectAudioElements(
	audioElementA: SerializedAudioElementWithId<AllowedSerializedAudioElements['type'], string>,
	audioElementsWithIds: SerializedAudioElementsWithIds,
	audioNodeDatabase: AudioNodeDatabase
): void {
	if (audioElementA.inputs) {
		for (const input of audioElementA.inputs) {
			const inputId = typeof input === 'string' ? input : input.id;
			const output = typeof input === 'string' ? undefined : input.output;

			const audioElementB = audioElementsWithIds[inputId];

			if (audioElementB === undefined) {
				throw new Error(`Audio element with id ${inputId} not found`);
			}

			connectAudioElements(audioElementB, audioElementA, audioNodeDatabase, output);
		}
	}
}

function connectAudioElements(
	audioElementA: SerializedAudioElementWithId<AllowedSerializedAudioElements['type'], string>,
	audioElementB: SerializedAudioElementWithId<AllowedSerializedAudioElements['type'], string>,
	audioNodeDatabase: AudioNodeDatabase,
	output?: string
): void {
	const audioNodeA = audioNodeDatabase[audioElementA.id];
	const audioNodeB = audioNodeDatabase[audioElementB.id];

	if (audioNodeA !== undefined && audioNodeB !== undefined) {
		console.log('connect');
		audioNodeA.connect(audioNodeB, output);
	}
}

function disconnectAudioElements(
	audioElementA: SerializedAudioElementWithId<AllowedSerializedAudioElements['type'], string>,
	audioElementB: SerializedAudioElementWithId<AllowedSerializedAudioElements['type'], string>,
	audioNodeDatabase: AudioNodeDatabase,
	output?: string
): void {
	const audioNodeA = audioNodeDatabase[audioElementA.id];
	const audioNodeB = audioNodeDatabase[audioElementB.id];

	if (audioNodeA !== undefined && audioNodeB !== undefined) {
		audioNodeA.disconnect(audioNodeB, output);
	}
}

function createCustomAudioNode(
	audioElement: SerializedAudioElement<AllowedSerializedAudioElements['type'], string>
): CustomAudioNode {
	switch (audioElement.type) {
		case 'oscillator':
			return new CustomOscillatorNode((audioElement as SerializedOscillatorNode).oscillatorType);
		case 'gain':
			return new CustomGainNode();
		case 'destination':
			return new DestinationNode();
		case 'trigger':
			return new TriggerNode();
		case 'envelope': {
			return new EnvelopeNode();
		}
		case 'sequencer': {
			const sequencerNode = audioElement as SerializedSequencerNode;
			return new SequencerNode(
				sequencerNode.tempoInBpm,
				sequencerNode.notes,
				sequencerNode.loopLength
			);
		}
		case 'midi':
			return new MidiNode();
		case 'oscilloscope':
			return new CustomOscilloscopeNode();
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

function accessParameter(audioNode: CustomAudioNode, parameterName: string): AudioParam {
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

	if (audioNode instanceof EnvelopeNode || audioNode instanceof TriggerNode) {
		const param = audioNode.webApiNode.parameters.get(parameterName);

		if (param) return param;
	}

	throw new Error(`Parameter ${parameterName} not found for ${audioNode.constructor}`);
}

function getAddedInputs(
	newAudioElement: SerializedAudioElement<AllowedSerializedAudioElements['type'], string>,
	oldAudioElement: SerializedAudioElement<AllowedSerializedAudioElements['type'], string>
) {
	const addedInputs: Inputs = [];

	if (newAudioElement.inputs && oldAudioElement.inputs) {
		for (const input of newAudioElement.inputs) {
			if (typeof input === 'string' && !oldAudioElement.inputs.includes(input)) {
				addedInputs.push(input);
			}

			if (
				typeof input !== 'string' &&
				!oldAudioElement.inputs.some((i) => typeof i !== 'string' && i.id === input.id)
			) {
				addedInputs.push(input);
			}
		}
	}

	return addedInputs;
}

function getRemovedInputs(
	newAudioElement: SerializedAudioElement<AllowedSerializedAudioElements['type'], string>,
	oldAudioElement: SerializedAudioElement<AllowedSerializedAudioElements['type'], string>
) {
	const removedInputs: Inputs = [];

	if (newAudioElement.inputs && oldAudioElement.inputs) {
		for (const input of oldAudioElement.inputs) {
			if (typeof input === 'string' && !newAudioElement.inputs.includes(input)) {
				removedInputs.push(input);
			}

			if (
				typeof input !== 'string' &&
				!newAudioElement.inputs.some((i) => typeof i !== 'string' && i.id === input.id)
			) {
				removedInputs.push(input);
			}
		}
	}

	return removedInputs;
}

const getChangedParameters = (
	newAudioElement: SerializedAudioElement<AllowedSerializedAudioElements['type'], string>,
	oldAudioElement: SerializedAudioElement<AllowedSerializedAudioElements['type'], string>
): string[] => {
	const changedParameters: string[] = [];

	if (newAudioElement.parameters && oldAudioElement.parameters) {
		for (const parameterName in newAudioElement.parameters) {
			const newParameterValue = newAudioElement.parameters[parameterName];
			const oldParameterValue = oldAudioElement.parameters[parameterName];

			if (Array.isArray(newParameterValue) && !Array.isArray(oldParameterValue)) {
				changedParameters.push(parameterName);
			}

			if (
				typeof newParameterValue === 'number' &&
				typeof oldParameterValue === 'number' &&
				newParameterValue !== oldParameterValue
			) {
				changedParameters.push(parameterName);
			}
		}
	}

	return changedParameters;
};

const getRemovedParameterInputs = (
	newAudioElement: SerializedAudioElement<AllowedSerializedAudioElements['type'], string>,
	oldAudioElement: SerializedAudioElement<AllowedSerializedAudioElements['type'], string>
): [string, string][] => {
	const removedParameterInputs: [string, string][] = [];

	if (newAudioElement.parameters && oldAudioElement.parameters) {
		for (const parameterName in oldAudioElement.parameters) {
			const newParameterValue = newAudioElement.parameters[parameterName];
			const oldParameterValue = oldAudioElement.parameters[parameterName];

			if (
				newParameterValue !== undefined &&
				oldParameterValue !== undefined &&
				typeof newParameterValue === 'number' &&
				typeof oldParameterValue !== 'number'
			) {
				removedParameterInputs.push(
					...oldParameterValue.map(
						(v) => [parameterName, typeof v === 'string' ? v : v.id] as [string, string]
					)
				);
			}
		}
	}

	return removedParameterInputs;
};
