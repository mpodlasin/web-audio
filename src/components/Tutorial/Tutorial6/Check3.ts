import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Spectrum node is connected to an Output node
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find required nodes
	const spectrumNode = nodes.find((node) => node.type === 'spectrum');
	const outputNode = nodes.find((node) => node.type === 'destination');

	// Ensure both nodes exist
	if (!spectrumNode || !outputNode) {
		return false;
	}

	// Get the Spectrum node's ID
	const spectrumNodeId = entries.find((entry) => entry[1] === spectrumNode)?.[0];

	// Check if Spectrum is connected to Output
	const isConnected = outputNode.inputs.some((input) => input.id === spectrumNodeId);

	return isConnected;
}
