export interface PlugPositions {
	[key: string]: {
		inputPlugPositions: { [key: string]: { x: number; y: number } };
		outputPlugPositions: { [key: string]: { x: number; y: number } };
		parameterKnobPositions: { [key: string]: { x: number; y: number } };
	};
}
