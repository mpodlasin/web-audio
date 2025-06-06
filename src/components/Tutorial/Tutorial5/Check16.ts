import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Count node is connected to the Switch node's channel parameter
// and the channel parameter is set to 1
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find the Count and Switch nodes
	const countNode = nodes.find((node) => node.type === 'count');
	const switchNode = nodes.find((node) => node.type === 'switch');

	// Ensure both nodes exist
	if (!countNode || !switchNode) return false;

	// Get the Count node ID
	const countId = entries.find((entry) => entry[1] === countNode)?.[0];

	// Check if the Switch node's channel parameter is set to 1
	const channelValue = switchNode.parameters?.channel?.base ?? 0;
	const channelIsOne = channelValue === 1;

	// Check if the Count node is connected to the Switch node's channel parameter
	const countConnectedToChannel =
		switchNode.parameters?.channel?.inputs.some((input) => input.id === countId) ?? false;

	// Both conditions must be true
	return channelIsOne && countConnectedToChannel;
}
