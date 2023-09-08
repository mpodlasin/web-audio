import { allowedSerializedAudioElementStaticDefinitions } from './staticDefinitions';
import type { AllowedSerializedAudioElements, SerializedAudioElements } from './types';

export const addNode = <S extends SerializedAudioElements>(
	audioGraph: S,
	type: AllowedSerializedAudioElements['type']
): S => {
	const idsSoFar = Object.keys(audioGraph);

	const nextId = Object.keys(audioGraph).length === 0 ? 1 : Math.max(...idsSoFar.map((id) => parseInt(id, 10))) + 1;

	const staticNodeDefinition = allowedSerializedAudioElementStaticDefinitions[type];

	return {
		...audioGraph,
		[nextId]: {
			type,
			inputs: [],
			parameters: Object.fromEntries(
				Object.entries(staticNodeDefinition.parameters).map(([key, value]) => [
					key,
					value.defaultValue
				])
			),
			...(type === 'oscillator'
				? {
						oscillatorType: 'sine'
				  }
				: {})
		}
	};
};

export const removeNode = <S extends SerializedAudioElements>(audioGraph: S, nodeId: string): S => {
	const newAudioGraph = { ...audioGraph };

	delete newAudioGraph[nodeId];

	Object.values(newAudioGraph).forEach((audioElement) => {
		audioElement.inputs = audioElement.inputs
			? audioElement.inputs.filter((input) => {
					if (typeof input === 'string') {
						return input !== nodeId;
					} else {
						return input.id !== nodeId;
					}
			  })
			: undefined;

		for (const parameterName in audioElement.parameters) {
			const parameterValue = audioElement.parameters[parameterName];

			if (Array.isArray(parameterValue)) {
				const filteredParameter = parameterValue.filter((input) => {
					if (typeof input === 'string') {
						return input !== nodeId;
					} else {
						return input.id !== nodeId;
					}
				});

				const staticNodeDefinition =
					allowedSerializedAudioElementStaticDefinitions[audioElement.type];
				const defaultParameterValue = staticNodeDefinition.parameters[parameterName]?.defaultValue;

				if (filteredParameter.length === 0 && defaultParameterValue !== undefined) {
					audioElement.parameters[parameterName] = defaultParameterValue;
				} else {
					audioElement.parameters[parameterName] = filteredParameter;
				}
			}
		}
	});

	return newAudioGraph;
};

export type Plug = {
	type: 'input' | 'output';
	nodeId: string;
	id: string;
};

export const addConnection = <S extends SerializedAudioElements>(
	audioGraph: S,
	startingPlug: Plug,
	endingPlug: Plug
): S => {
	if (startingPlug.type === endingPlug.type) {
		throw new Error(`You tried connecting two ${startingPlug.type}s together`);
	}

	if (startingPlug.nodeId === endingPlug.nodeId) {
		throw new Error(`You tried connecting a node to itself`);
	}

	let newAudioGraph: S;

	if (endingPlug.type === 'input' && startingPlug.type === 'output') {
		const startingNode = audioGraph[startingPlug.nodeId];
		const endingNode = audioGraph[endingPlug.nodeId];

		if (startingNode === undefined) {
			throw new Error(`Audio element with id ${startingPlug.nodeId} not found`);
		}

		if (endingNode === undefined) {
			throw new Error(`Audio element with id ${endingPlug.nodeId} not found`);
		}

		const startingNodeStaticDefinition =
			allowedSerializedAudioElementStaticDefinitions[startingNode.type];

		newAudioGraph = {
			...audioGraph,
			[endingPlug.nodeId]: {
				...endingNode,
				inputs: [
					...(endingNode.inputs ?? []),
					startingNodeStaticDefinition.outputs[0] === startingPlug.id
						? startingPlug.nodeId
						: { id: startingPlug.nodeId, output: startingPlug.id }
				]
			}
		};
	} else if (endingPlug.type === 'output' && startingPlug.type === 'input') {
		const startingNode = audioGraph[startingPlug.nodeId];
		const endingNode = audioGraph[endingPlug.nodeId];

		if (startingNode === undefined) {
			throw new Error(`Audio element with id ${startingPlug.nodeId} not found`);
		}

		if (endingNode === undefined) {
			throw new Error(`Audio element with id ${endingPlug.nodeId} not found`);
		}

		const endingNodeStaticDefinition =
			allowedSerializedAudioElementStaticDefinitions[endingNode.type];

		newAudioGraph = {
			...audioGraph,
			[startingPlug.nodeId]: {
				...startingNode,
				inputs: [
					...(startingNode.inputs ?? []),
					endingNodeStaticDefinition.outputs[0] === endingPlug.id
						? endingPlug.nodeId
						: { id: endingPlug.nodeId, output: endingPlug.id }
				]
			}
		};
	} else {
		newAudioGraph = { ...audioGraph };
	}

	return newAudioGraph;
};

export const addConnectionToParameter = <S extends SerializedAudioElements>(
	audioGraph: S,
	startingPlug: Plug,
	endingPlug: Plug
): S => {
	if (startingPlug.type === endingPlug.type) {
		throw new Error(`You tried connecting two ${startingPlug.type}s together`);
	}

	if (startingPlug.nodeId === endingPlug.nodeId) {
		throw new Error(`You tried connecting a node to itself`);
	}

	let newAudioGraph: S;

	if (endingPlug.type === 'input' && startingPlug.type === 'output') {
		const startingNode = audioGraph[startingPlug.nodeId];
		const endingNode = audioGraph[endingPlug.nodeId];

		if (startingNode === undefined) {
			throw new Error(`Audio element with id ${startingPlug.nodeId} not found`);
		}

		if (endingNode === undefined) {
			throw new Error(`Audio element with id ${endingPlug.nodeId} not found`);
		}

		const startingNodeStaticDefinition =
			allowedSerializedAudioElementStaticDefinitions[startingNode.type];

		const parameter = endingNode.parameters?.[endingPlug.id];

		newAudioGraph = {
			...audioGraph,
			[endingPlug.nodeId]: {
				...endingNode,
				parameters: {
					...endingNode.parameters,
					[endingPlug.id]: [
						...(Array.isArray(parameter) ? parameter : []),
						startingNodeStaticDefinition.outputs[0] === startingPlug.id
							? startingPlug.nodeId
							: { id: startingPlug.nodeId, output: startingPlug.id }
					]
				}
			}
		};
	} else {
		newAudioGraph = { ...audioGraph };
	}

	return newAudioGraph;
};

export const removeConnection = <S extends SerializedAudioElements>(
	audioGraph: S,
	startingPlug: Plug,
	endingPlug: Plug
): S => {
	if (startingPlug.type === endingPlug.type) {
		throw new Error(`You tried unconnecting two ${startingPlug.type}s together`);
	}

	if (startingPlug.nodeId === endingPlug.nodeId) {
		throw new Error(`You tried unconnecting a node from itself`);
	}

	let newAudioGraph: S;

	if (endingPlug.type === 'input' && startingPlug.type === 'output') {
		const endingNode = audioGraph[endingPlug.nodeId];

		if (endingNode === undefined) {
			throw new Error(`Audio element with id ${endingPlug.nodeId} not found`);
		}

		newAudioGraph = {
			...audioGraph,
			[endingPlug.nodeId]: {
				...endingNode,
				inputs: (endingNode.inputs ?? []).filter((input) => {
					if (typeof input === 'string') {
						return input !== startingPlug.nodeId;
					} else {
						return false;
					}
				}),
				parameters: Object.fromEntries(
					Object.entries(endingNode.parameters ?? {}).map(([key, value]) => {
						if (Array.isArray(value)) {
							const endingNodeStaticDefinition =
								allowedSerializedAudioElementStaticDefinitions[endingNode.type];
							const defaultParameterValue =
								endingNodeStaticDefinition.parameters[key]?.defaultValue;
							const filteredArray = value.filter((input) => {
								if (typeof input === 'string') {
									return input !== startingPlug.nodeId;
								} else {
									return false;
								}
							});
							return [key, filteredArray.length === 0 ? defaultParameterValue : filteredArray];
						} else {
							return [key, value];
						}
					})
				)
			}
		};
	} else {
		newAudioGraph = { ...audioGraph };
	}

	return newAudioGraph;
};

export const changeParameter = <S extends SerializedAudioElements>(
	audioGraph: S,
	nodeId: string,
	parameterName: string,
	value: number
): S => {
	const node = audioGraph[nodeId];

	if (node === undefined) {
		throw new Error(`Audio element with id ${nodeId} not found`);
	}

	return {
		...audioGraph,
		[nodeId]: {
			...node,
			parameters: {
				...node.parameters,
				[parameterName]: value
			} as any /* TODO: Fix this */
		}
	};
};
