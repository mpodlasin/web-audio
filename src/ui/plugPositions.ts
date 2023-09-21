export interface PlugPositions {
	[key: string]: PlugPositionsForNode;
}

export interface PlugPositionsForNode {
	inputPlugPositions: { [key: string]: { x: number; y: number } };
	outputPlugPositions: { [key: string]: { x: number; y: number } };
	parameterKnobPositions: { [key: string]: { x: number; y: number } };
}

export const addDiff = (
	plugPositions: PlugPositionsForNode,
	diffX: number,
	diffY: number
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
	diffX: number,
	diffY: number
): PlugPositions => {
	return Object.fromEntries(
		Object.entries(plugPositions).map(([id, positions]) => [id, addDiff(positions, diffX, diffY)])
	);
};
