import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Switch node is connected to the Output node
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find required nodes
	const switchNode = nodes.find((node) => node.type === 'switch');
	const outputNode = nodes.find((node) => node.type === 'destination');

	// Ensure both nodes exist
	if (!switchNode || !outputNode) {
		return false;
	}

	// Get the switch node's ID
	const switchNodeId = entries.find((entry) => entry[1] === switchNode)?.[0];

	// Check if switch node is connected to output node
	return outputNode.inputs.some((input) => input.id === switchNodeId);
}
