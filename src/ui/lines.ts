import {
	allowedSerializedAudioElementStaticDefinitions,
	type Plug,
	type Position,
	type SerializedAudioElements
} from '../audio/serialized';
import type { PlugPositions } from './plugPositions';

export interface LineToDisplay {
	line: readonly [Plug, Plug];
	multiply?: number;
	from: Position;
	to: Position;
}

export const getLinesToDisplay = (
	audioGraphWithPositions: SerializedAudioElements,
	plugPositions: PlugPositions,
	{ top, left }: { top: number; left: number }
): LineToDisplay[] => {
	const lines = Object.entries(audioGraphWithPositions).reduce(
		(
			acc: (readonly [readonly [string, string], readonly [string, string], number | undefined])[],
			[id, node]
		) => {
			const staticToDefinition = allowedSerializedAudioElementStaticDefinitions[node.type];

			const mapped = node.inputs
				? node.inputs.map((input) => {
						if (typeof input === 'string') {
							const staticNodeDefinition =
								allowedSerializedAudioElementStaticDefinitions[
									audioGraphWithPositions[input]?.type ?? 'sine-oscillator'
								];
							return [
								[input, staticNodeDefinition.outputs[0] as string],
								[id, staticToDefinition.inputs[0] as string],
								undefined
							] as const;
						} else {
							return [
								[input.id, input.output],
								[id, input.input ?? staticToDefinition.inputs[0] ?? ''],
								undefined
							] as const;
						}
				  })
				: [];

			const mappedParams = node.parameters
				? Object.entries(node.parameters).flatMap(([key, value]) => {
						return value.inputs.map((input) => {
							return [[input.id, input.output], [id, key], input.multiply] as const;
						});
				  })
				: [];

			return [...mapped, ...mappedParams, ...acc];
		},
		[]
	);

	return lines.flatMap(([from, to, multiply]) => {
		const [fromId, fromName] = from;
		const [toId, toName] = to;

		const fromNode = audioGraphWithPositions[fromId];
		const toNode = audioGraphWithPositions[toId];

		if (!fromNode || !toNode) {
			return [];
		}

		const fromPlugPosition = plugPositions[fromId]?.outputPlugPositions[fromName];
		const toPlugPosition = plugPositions[toId]?.inputPlugPositions[toName];
		const toParameterKnobPosition = plugPositions[toId]?.parameterKnobPositions[toName];

		if (fromPlugPosition && toParameterKnobPosition) {
			return [
				{
					line: [
						{
							nodeId: fromId,
							type: 'output',
							id: fromName
						},
						{
							nodeId: toId,
							type: 'input',
							id: toName
						}
					] as const,
					multiply,
					from: {
						x: fromPlugPosition.x - left,
						y: fromPlugPosition.y - top
					},
					to: {
						x: toParameterKnobPosition.x - left,
						y: toParameterKnobPosition.y - top
					}
				}
			];
		}

		if (fromPlugPosition && toPlugPosition) {
			return [
				{
					line: [
						{
							nodeId: fromId,
							type: 'output',
							id: fromName
						},
						{
							nodeId: toId,
							type: 'input',
							id: toName
						}
					] as const,
					from: {
						x: fromPlugPosition.x - left,
						y: fromPlugPosition.y - top
					},
					to: {
						x: toPlugPosition.x - left,
						y: toPlugPosition.y - top
					}
				}
			];
		}

		return [];
	});
};
