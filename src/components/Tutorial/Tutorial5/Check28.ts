import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Count node's modulo parameter has been changed from 4
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Find the Count node
	const countNode = nodes.find((node) => node.type === 'count');

	// Ensure the Count node exists
	if (!countNode) {
		return false;
	}

	// Check if the modulo parameter has been changed from 4
	const modulo = countNode.parameters?.modulo?.base ?? 4;

	// The modulo should be different from 4 (either 2 or 3 as suggested in the tutorial)
	return modulo !== 4;
}
