import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that five Times nodes are created
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Find times nodes - should have exactly 5
	const timesNodes = nodes.filter((node) => node.type === 'times');
	return timesNodes.length == 5;
}
