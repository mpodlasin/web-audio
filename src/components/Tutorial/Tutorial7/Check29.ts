import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that harmonic Number nodes connect to first input of Times nodes, and main frequency Number connects to second input of all Times nodes
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// 1. Find required nodes
	const numberNodes = nodes.filter((node) => node.type === 'number');
	const timesNodes = nodes.filter((node) => node.type === 'times');

	// Should have exactly 5 Times nodes
	if (timesNodes.length !== 5) return false;

	// 2. Find specific Number nodes
	const mainFreqNumber = numberNodes.find((num) => num.parameters?.value?.base === 440);
	const harmonicNumbers = [2, 3, 4, 5, 6].map((val) =>
		numberNodes.find((num) => num.parameters?.value?.base === val)
	);

	if (!mainFreqNumber || harmonicNumbers.some((num) => !num)) return false;

	// 3. Get node IDs
	const mainFreqId = entries.find((entry) => entry[1] === mainFreqNumber)?.[0];
	const harmonicIds = harmonicNumbers
		.map((num) => entries.find((entry) => entry[1] === num)?.[0])
		.filter((id) => id !== undefined);

	if (!mainFreqId || harmonicIds.length !== 5) return false;

	// 4. Check main frequency connects to ALL Times nodes (second input 'number-b')
	const mainConnectedToAllTimes = timesNodes.every((timesNode) =>
		timesNode.inputs.some((input) => input.id === mainFreqId && input.input === 'number-b')
	);

	if (!mainConnectedToAllTimes) return false;

	// 5. Check each harmonic connects to DIFFERENT Times nodes (first input 'number-a')
	const timesNodesConnectedToHarmonics: any[] = [];

	for (const harmonicId of harmonicIds) {
		const connectedTimesNode = timesNodes.find((timesNode) =>
			timesNode.inputs.some((input) => input.id === harmonicId && input.input === 'number-a')
		);

		if (!connectedTimesNode) return false;

		// Check if this Times node was already used by another harmonic
		if (timesNodesConnectedToHarmonics.includes(connectedTimesNode)) {
			return false; // Duplicate connection!
		}

		timesNodesConnectedToHarmonics.push(connectedTimesNode);
	}

	// 6. Ensure we used all 5 Times nodes
	return timesNodesConnectedToHarmonics.length === 5;
}
