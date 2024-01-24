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
	return mapPositions(plugPositions, ({ x, y }) => ({ x: x + diffX, y: y + diffY }));
};

export const mapPositions = (
	plugPositions: PlugPositionsForNode,
	fn: (position: Position) => Position
) => {
	return {
		inputPlugPositions: Object.fromEntries(
			Object.entries(plugPositions.inputPlugPositions ?? {}).map(([key, position]) => [
				key,
				fn(position)
			])
		),
		outputPlugPositions: Object.fromEntries(
			Object.entries(plugPositions.outputPlugPositions ?? {}).map(([key, position]) => [
				key,
				fn(position)
			])
		),
		parameterKnobPositions: Object.fromEntries(
			Object.entries(plugPositions.parameterKnobPositions ?? {}).map(([key, position]) => [
				key,
				fn(position)
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

export const mapAllPositions = (
	plugPositions: PlugPositions,
	fn: (position: Position) => Position
) => {
	return Object.fromEntries(
		Object.entries(plugPositions).map(([id, positions]) => [id, mapPositions(positions, fn)])
	);
};
