import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Switch node exists
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Find the Switch node
	const switchNode = nodes.find((node) => node.type === 'switch');

	// Switch node must exist
	return !!switchNode;
}
