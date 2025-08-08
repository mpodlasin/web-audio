import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that five more Number nodes are created (total of 6)
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	
	// Find number nodes - should have at least 6 total
	const numberNodes = nodes.filter(node => node.type === 'number');
	return numberNodes.length == 6;
}
