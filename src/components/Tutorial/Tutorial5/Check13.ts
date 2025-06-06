import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Count node's modulo parameter is set to 4
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Find the Count node
	const countNode = nodes.find((node) => node.type === 'count');

	// Ensure the Count node exists
	if (!countNode) {
		return false;
	}

	// Check if the modulo parameter is set to 4
	const modulo = countNode.parameters?.modulo?.base ?? 8; // Default is usually 8

	return modulo === 4;
}
