import type { Position } from '../audio/serialized';

export interface PlugPositions {
	[key: string]: PlugPositionsForNode;
}

export interface PlugPositionsForNode {
	inputPlugPositions: { [key: string]: Position };
	outputPlugPositions: { [key: string]: Position };
	parameterKnobPositions: { [key: string]: Position };
}

export const addDiff = (
	plugPositions: PlugPositionsForNode,
	{ x: diffX, y: diffY }: Position
): PlugPositionsForNode => {
	return {
		inputPlugPositions: Object.fromEntries(
			Object.entries(plugPositions.inputPlugPositions ?? {}).map(([key, { x, y }]) => [
				key,
				{ x: x + diffX, y: y + diffY }
			])
		),
		outputPlugPositions: Object.fromEntries(
			Object.entries(plugPositions.outputPlugPositions ?? {}).map(([key, { x, y }]) => [
				key,
				{ x: x + diffX, y: y + diffY }
			])
		),
		parameterKnobPositions: Object.fromEntries(
			Object.entries(plugPositions.parameterKnobPositions ?? {}).map(([key, { x, y }]) => [
				key,
				{ x: x + diffX, y: y + diffY }
			])
		)
	};
};

export const addDiffToAllPositions = (
	plugPositions: PlugPositions,
	position: Position
): PlugPositions => {
	return Object.fromEntries(
		Object.entries(plugPositions).map(([id, positions]) => [id, addDiff(positions, position)])
	);
};
