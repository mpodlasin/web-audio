import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Switch node's channel parameter is set to 2
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Find the Switch node
	const switchNode = nodes.find((node) => node.type === 'switch');
	if (!switchNode) {
		return false;
	}

	// Check if the channel parameter is set to 2
	const channelValue = switchNode.parameters?.channel?.base ?? 1;
	return channelValue === 2;
}
