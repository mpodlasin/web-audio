import { allowedSerializedAudioElementStaticDefinitions } from './staticDefinitions';
import type { AllowedSerializedAudioElements, Position, SerializedAudioElements } from './types';

const generateId = (audioGraph: SerializedAudioElements) => {
	const idsSoFar = Object.keys(audioGraph);

	return Object.keys(audioGraph).length === 0
		? 1
		: Math.max(...idsSoFar.map((id) => parseInt(id, 10))) + 1;
};

export const insertExistingNodes = (
	audioGraph: SerializedAudioElements,
	ids: string[],
	position: Position
): SerializedAudioElements => {
	const idMap = Object.fromEntries(
		ids.map((id, index) => [id, `${generateId(audioGraph) + index}`])
	);

	const idsAndNodes = ids.flatMap((id) => {
		const node = audioGraph[id];

		if (node) {
			return [[id, node] as const];
		}

		return [];
	});

	const nodesWithRewrittenIds = idsAndNodes.map(([id, node]) => {
		const rewrittenInputs = node.inputs?.map((input) => {
			if (typeof input === 'string') {
				if (ids.some((id) => id === input)) {
					return idMap[input] ?? '';
				}

				return input;
			}

			if (ids.some((id) => id === input.id)) {
				return {
					...input,
					id: idMap[input.id] ?? ''
				};
			}

			return input;
		});

		const rewrittenParameters =
			node.parameters !== undefined
				? Object.fromEntries(
						Object.entries(node.parameters).map(([parameterName, parameterValue]) => {
							return [
								parameterName,
								{
									...parameterValue,
									inputs: parameterValue.inputs.map((input) => {
										if (ids.some((id) => id === input.id)) {
											return {
												...input,
												id: idMap[input.id] ?? ''
											};
										}

										return input;
									})
								}
							];
						})
				  )
				: undefined;

		const rewrittenNode = {
			...node,
			inputs: rewrittenInputs,
			parameters: rewrittenParameters,
			ui: {
				position
			}
		};
		return [idMap[id], rewrittenNode] as const;
	});

	const rewrittenAudioGraph = Object.fromEntries(
		Object.entries(audioGraph).map(([id, node]) => {
			return [
				id,
				{
					...node,
					inputs: node.inputs?.flatMap<string | { id: string; output: string }>((input) => {
						if (typeof input === 'string') {
							const foundId = ids.find((id) => id === input);

							if (foundId) {
								return [input, idMap[foundId] ?? ''];
							}
						} else {
							const foundId = ids.find((id) => id === input.id);

							if (foundId) {
								return [input, { id: idMap[foundId] ?? '', output: input.output }];
							}
						}

						return [];
					}),
					parameters: Object.fromEntries(
						Object.entries(node.parameters ?? {}).map(([parameterName, parameterValue]) => {
							return [
								parameterName,
								{
									...parameterValue,
									inputs: parameterValue.inputs.flatMap<string | { id: string; output: string }>(
										(input) => {
											if (typeof input === 'string') {
												const foundId = ids.find((id) => id === input);

												if (foundId) {
													return [input, idMap[foundId] ?? ''];
												}
											} else {
												const foundId = ids.find((id) => id === input.id);

												if (foundId) {
													return [input, { id: idMap[foundId] ?? '', output: input.output }];
												}
											}

											return [];
										}
									)
								}
							];
						})
					)
				}
			];
		})
	);

	return {
		...rewrittenAudioGraph,
		...Object.fromEntries(nodesWithRewrittenIds)
	};
};

export const addNode = <S extends SerializedAudioElements>(
	audioGraph: S,
	type: AllowedSerializedAudioElements['type'],
	position?: Position
): S => {
	const nextId = generateId(audioGraph);

	const staticNodeDefinition = allowedSerializedAudioElementStaticDefinitions[type];

	return {
		...audioGraph,
		[nextId]: {
			type,
			inputs: [],
			ui: {
				position
			},
			parameters: Object.fromEntries(
				Object.entries(staticNodeDefinition.parameters).map(([key, value]) => [
					key,
					{ base: value.defaultValue, inputs: [] }
				])
			)
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

			if (parameterValue) {
				parameterValue.inputs = parameterValue.inputs.filter((input) => input.id !== nodeId);
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

export const plugsEqual = (plugA: Plug, plugB: Plug): boolean => {
	return plugA.id === plugB.id && plugA.nodeId === plugB.nodeId && plugA.type === plugB.type;
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

		const parameter = endingNode.parameters?.[endingPlug.id];

		newAudioGraph = {
			...audioGraph,
			[endingPlug.nodeId]: {
				...endingNode,
				parameters: {
					...endingNode.parameters,
					[endingPlug.id]: {
						...parameter,
						inputs: [
							...(parameter?.inputs ?? []),
							{
								id: startingPlug.nodeId,
								output: startingPlug.id
							}
						]
					}
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

		const endingNodeStaticDefinition =
			allowedSerializedAudioElementStaticDefinitions[endingNode.type];

		newAudioGraph = {
			...audioGraph,
			[endingPlug.nodeId]: {
				...endingNode,
				inputs: (endingNode.inputs ?? []).filter((input) => {
					if (typeof input === 'string') {
						return (
							input !== startingPlug.nodeId ||
							endingNodeStaticDefinition.inputs[0] !== endingPlug.id
						);
					} else {
						return input.output !== endingPlug.id || input.id !== startingPlug.nodeId;
					}
				}),
				parameters: Object.fromEntries(
					Object.entries(endingNode.parameters ?? {}).map(([parameterName, value]) => {
						return [
							parameterName,
							{
								...value,
								inputs:
									parameterName === endingPlug.id
										? value.inputs.filter((input) => input.id !== startingPlug.nodeId)
										: value.inputs
							}
						];
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
				[parameterName]: {
					...node.parameters?.[parameterName],
					base: value
				}
			}
		}
	};
};
