import type {
	AllowedSerializedAudioElements,
	SerializedAudioElementWithId,
	SerializedAudioElementsWithIds,
	SerializedAudioElement,
	SerializedAudioElements,
	Inputs
} from '../serialized';
import {
	CustomBipolarToUnipolarNode,
	CustomConvolutionNode,
	CustomDelayNode,
	CustomGainNode,
	CustomLowpassFilterNode,
	CustomMultiplyNode,
	CustomOscilloscopeNode,
	CustomPanNode,
	CustomSawOscillatorNode,
	CustomSineOscillatorNode,
	CustomSquareOscillatorNode,
	CustomTriangleOscillatorNode,
	DestinationNode,
	AREnvelopeNode,
	MidiNode,
	PitchQuantizerNode,
	SequencerNode,
	TriggerNode,
	CustomGateLengthNode,
	ADEnvelopeNode,
	CustomHighpassFilterNode,
	CustomBandpassFilterNode,
	MeasureGateNode,
	CustomSawLFONode,
	CustomSquareLFONode,
	CustomTriangleLFONode,
	CustomSineLFONode,
	CustomPatternNode
} from './nodes';
import {
	isCustomAudioScheduledSourceNode,
	type CustomAudioNode,
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

				node.disconnect();
			}

			delete audioNodeDatabase[id];
		}
	});

	/* add new nodes */

	Object.entries(newAudioElements).forEach(([id, newAudioElement]) => {
		const oldAudioElement = oldAudioElements[id];

		if (oldAudioElement === undefined) {
			const createdAudioNode = createCustomAudioNode(id, newAudioElement);

			if (createdAudioNode !== null) {
				if (isCustomAudioScheduledSourceNode(createdAudioNode)) {
					createdAudioNode.start();
				}
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
				const inputName = typeof input === 'string' ? undefined : input.input;

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
					output,
					inputName
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

			setParameterValues(
				{
					...newAudioElement,
					id
				},
				audioNodeDatabase
			);
		} else {
			const changedParametersWithConnections = getParametersWithAddedInputs(
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

			const parametersWithChangedValues = getParametersWithChangedValues(
				newAudioElement,
				oldAudioElement
			);
			parametersWithChangedValues.forEach((parameterName) => {
				setParameterValue(
					{
						...newAudioElement,
						id
					},
					parameterName,
					audioNodeDatabase
				);
			});

			const parametersWithChangedMultipliers = getParametersWithChangedMultipliers(
				newAudioElement,
				oldAudioElement
			);

			parametersWithChangedMultipliers.forEach(({ parameterName, inputId, value }) => {
				const node = audioNodeDatabase[id];

				if (node) {
					node.getParameter(parameterName).getMultiplierForInput(inputId).gain.value = value;
				}
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
			const inputName = typeof input === 'string' ? undefined : input.input;

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
				output,
				inputName
			);
		});
	});

	/* removes connections to parameters */
	Object.entries(newAudioElements).forEach(([id, newAudioElement]) => {
		const oldAudioElement = oldAudioElements[id];

		if (oldAudioElement === undefined) return;

		const removedInputs = getRemovedParameterInputs(newAudioElement, oldAudioElement);

		removedInputs.forEach(([parameterName, nodeId, output]) => {
			const audioElementNode = audioNodeDatabase[id];
			const removedInputNode = audioNodeDatabase[nodeId];

			if (removedInputNode && audioElementNode) {
				removedInputNode.getOutput(output).disconnect(audioElementNode.getParameter(parameterName));
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

function setParameterValues(
	audioElementA: SerializedAudioElementWithId<AllowedSerializedAudioElements['type'], string>,
	audioNodeDatabase: AudioNodeDatabase
): void {
	if (audioElementA.parameters) {
		for (const parameterName in audioElementA.parameters) {
			setParameterValue(audioElementA, parameterName, audioNodeDatabase);
		}
	}
}

function setParameterValue(
	audioElementA: SerializedAudioElementWithId<AllowedSerializedAudioElements['type'], string>,
	parameterName: string,
	audioNodeDatabase: AudioNodeDatabase
) {
	const audioNodeA = audioNodeDatabase[audioElementA.id];
	const parameterValue = audioElementA.parameters?.[parameterName];

	if (audioNodeA !== undefined && parameterValue !== undefined) {
		audioNodeA.getParameter(parameterName).audioParam.value = parameterValue.base;
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

	if (parameterValue && parameterValue.inputs.length > 0) {
		for (const input of parameterValue.inputs) {
			const inputId = input.id;
			const output = input.output;
			const mult = input.multiply;

			const audioElementB = audioElementsWithIds[inputId];

			if (audioElementB === undefined) {
				throw new Error(`Audio element with id ${inputId} not found`);
			}

			const audioNodeB = audioNodeDatabase[audioElementB.id];

			if (audioNodeA !== undefined && audioNodeB !== undefined) {
				audioNodeB.getOutput(output).connect(audioNodeA.getParameter(parameterName));

				audioNodeA.getParameter(parameterName).getMultiplierForInput(inputId).gain.value =
					mult ?? 1;
			}
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
			const inputName = typeof input === 'string' ? undefined : input.input;

			const audioElementB = audioElementsWithIds[inputId];

			if (audioElementB === undefined) {
				throw new Error(`Audio element with id ${inputId} not found`);
			}

			connectAudioElements(audioElementB, audioElementA, audioNodeDatabase, output, inputName);
		}
	}
}

function connectAudioElements(
	audioElementA: SerializedAudioElementWithId<AllowedSerializedAudioElements['type'], string>,
	audioElementB: SerializedAudioElementWithId<AllowedSerializedAudioElements['type'], string>,
	audioNodeDatabase: AudioNodeDatabase,
	output?: string,
	input?: string
): void {
	const audioNodeA = audioNodeDatabase[audioElementA.id];
	const audioNodeB = audioNodeDatabase[audioElementB.id];

	if (audioNodeA !== undefined && audioNodeB !== undefined) {
		const audioNodeBInput = audioNodeB.getInputNode(input);

		if (audioNodeBInput) {
			audioNodeA.getOutput(output).connect(audioNodeBInput);
		}
	}
}

function disconnectAudioElements(
	audioElementA: SerializedAudioElementWithId<AllowedSerializedAudioElements['type'], string>,
	audioElementB: SerializedAudioElementWithId<AllowedSerializedAudioElements['type'], string>,
	audioNodeDatabase: AudioNodeDatabase,
	output?: string,
	input?: string
): void {
	const audioNodeA = audioNodeDatabase[audioElementA.id];
	const audioNodeB = audioNodeDatabase[audioElementB.id];

	if (audioNodeA !== undefined && audioNodeB !== undefined) {
		const audioNodeBInput = audioNodeB.getInputNode(input);

		if (audioNodeBInput) {
			audioNodeA.getOutput(output).disconnect(audioNodeBInput);
		}
	}
}

function createCustomAudioNode(
	id: string,
	audioElement: SerializedAudioElement<AllowedSerializedAudioElements['type'], string>
): CustomAudioNode {
	switch (audioElement.type) {
		case 'sine-oscillator':
			return new CustomSineOscillatorNode(id);
		case 'saw-oscillator':
			return new CustomSawOscillatorNode(id);
		case 'square-oscillator':
			return new CustomSquareOscillatorNode(id);
		case 'triangle-oscillator':
			return new CustomTriangleOscillatorNode(id);
		case 'lowpass-filter':
			return new CustomLowpassFilterNode(id);
		case 'highpass-filter':
			return new CustomHighpassFilterNode(id);
		case 'bandpass-filter':
			return new CustomBandpassFilterNode(id);
		case 'gain':
			return new CustomGainNode(id);
		case 'multiply':
			return new CustomMultiplyNode(id);
		case 'destination':
			return new DestinationNode(id);
		case 'trigger':
			return new TriggerNode(id);
		case 'ar-envelope':
			return new AREnvelopeNode(id);
		case 'ad-envelope':
			return new ADEnvelopeNode(id);
		case 'sequencer':
			return new SequencerNode(id);
		case 'midi':
			return new MidiNode(id);
		case 'oscilloscope':
			return new CustomOscilloscopeNode(id);
		case 'convolution':
			return new CustomConvolutionNode(id);
		case 'delay':
			return new CustomDelayNode(id);
		case 'pitch-quantizer':
			return new PitchQuantizerNode(id);
		case 'pan':
			return new CustomPanNode(id);
		case 'bipolar-to-unipolar':
			return new CustomBipolarToUnipolarNode(id);
		case 'gate-length':
			return new CustomGateLengthNode(id);
		case 'measure-gate':
			return new MeasureGateNode(id);
		case 'saw-lfo':
			return new CustomSawLFONode(id);
		case 'square-lfo':
			return new CustomSquareLFONode(id);
		case 'triangle-lfo':
			return new CustomTriangleLFONode(id);
		case 'sine-lfo':
			return new CustomSineLFONode(id);
		case 'pattern':
			return new CustomPatternNode(id);
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

export function accessParameter(audioNode: AudioNode, parameterName: string): AudioParam {
	if (audioNode instanceof OscillatorNode) {
		switch (parameterName) {
			case 'frequency':
				return audioNode.frequency;
			case 'detune':
				return audioNode.detune;
		}
	}

	if (audioNode instanceof StereoPannerNode) {
		switch (parameterName) {
			case 'pan':
				return audioNode.pan;
		}
	}

	if (audioNode instanceof GainNode) {
		switch (parameterName) {
			case 'gain':
				return audioNode.gain;
		}
	}

	if (audioNode instanceof BiquadFilterNode) {
		switch (parameterName) {
			case 'frequency':
				return audioNode.frequency;
			case 'Q':
				return audioNode.Q;
		}
	}

	if (audioNode instanceof DelayNode) {
		switch (parameterName) {
			case 'delayTime':
				return audioNode.delayTime;
		}
	}

	if (audioNode instanceof AudioWorkletNode) {
		const param = audioNode.parameters.get(parameterName);

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
				!oldAudioElement.inputs.some(
					(i) =>
						typeof i !== 'string' &&
						i.id === input.id &&
						i.output === input.output &&
						i.input === input.input
				)
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
		for (const oldInput of oldAudioElement.inputs) {
			if (typeof oldInput === 'string' && !newAudioElement.inputs.includes(oldInput)) {
				removedInputs.push(oldInput);
			}

			if (
				typeof oldInput !== 'string' &&
				!newAudioElement.inputs.some(
					(i) =>
						typeof i !== 'string' &&
						i.id === oldInput.id &&
						i.output === oldInput.output &&
						i.input === oldInput.input
				)
			) {
				removedInputs.push(oldInput);
			}
		}
	}

	return removedInputs;
}

const getParametersWithChangedValues = (
	newAudioElement: SerializedAudioElement<AllowedSerializedAudioElements['type'], string>,
	oldAudioElement: SerializedAudioElement<AllowedSerializedAudioElements['type'], string>
): string[] => {
	const changedParameters: string[] = [];

	if (newAudioElement.parameters && oldAudioElement.parameters) {
		for (const parameterName in newAudioElement.parameters) {
			const newParameterValue = newAudioElement.parameters[parameterName];
			const oldParameterValue = oldAudioElement.parameters[parameterName];

			if (
				newParameterValue !== undefined &&
				oldParameterValue !== undefined &&
				newParameterValue.base !== oldParameterValue.base
			) {
				changedParameters.push(parameterName);
			}
		}
	}

	return changedParameters;
};

const getParametersWithChangedMultipliers = (
	newAudioElement: SerializedAudioElement<AllowedSerializedAudioElements['type'], string>,
	oldAudioElement: SerializedAudioElement<AllowedSerializedAudioElements['type'], string>
): { parameterName: string; inputId: string; value: number }[] => {
	const changedParameters: { parameterName: string; inputId: string; value: number }[] = [];

	if (newAudioElement.parameters && oldAudioElement.parameters) {
		for (const parameterName in newAudioElement.parameters) {
			const newParameterValue = newAudioElement.parameters[parameterName];
			const oldParameterValue = oldAudioElement.parameters[parameterName];

			if (newParameterValue !== undefined && oldParameterValue !== undefined) {
				const inputsWithDifferentMultiplies = newParameterValue.inputs.filter((newInput) => {
					const oldInput = oldParameterValue.inputs.find((input) => input.id === newInput.id);

					if (oldInput) {
						return oldInput.multiply !== newInput.multiply;
					}

					return false;
				});

				changedParameters.push(
					...inputsWithDifferentMultiplies.map((input) => ({
						inputId: input.id,
						parameterName,
						value: input.multiply ?? 1
					}))
				);
			}
		}
	}

	return changedParameters;
};

const getParametersWithAddedInputs = (
	newAudioElement: SerializedAudioElement<AllowedSerializedAudioElements['type'], string>,
	oldAudioElement: SerializedAudioElement<AllowedSerializedAudioElements['type'], string>
): string[] => {
	const changedParameters: string[] = [];

	if (newAudioElement.parameters && oldAudioElement.parameters) {
		for (const parameterName in newAudioElement.parameters) {
			const newParameterValue = newAudioElement.parameters[parameterName];
			const oldParameterValue = oldAudioElement.parameters[parameterName];

			if (
				newParameterValue !== undefined &&
				oldParameterValue !== undefined &&
				newParameterValue.inputs.length > oldParameterValue.inputs.length
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
): [string, string, string][] => {
	const removedParameterInputs: [string, string, string][] = [];

	if (newAudioElement.parameters && oldAudioElement.parameters) {
		for (const parameterName in oldAudioElement.parameters) {
			const newParameterValue = newAudioElement.parameters[parameterName];
			const oldParameterValue = oldAudioElement.parameters[parameterName];

			if (newParameterValue !== undefined && oldParameterValue !== undefined) {
				removedParameterInputs.push(
					...oldParameterValue.inputs
						.filter((input) => !newParameterValue.inputs.some((i) => i.id === input.id))
						.map(({ id, output }) => [parameterName, id, output] as [string, string, string])
				);
			}
		}
	}

	return removedParameterInputs;
};
