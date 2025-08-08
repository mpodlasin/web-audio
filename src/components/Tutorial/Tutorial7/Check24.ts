import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Number node is created
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	
	// Find number nodes - should have at least 1
	const numberNodes = nodes.filter(node => node.type === 'number');
	return numberNodes.length >= 1;
}
