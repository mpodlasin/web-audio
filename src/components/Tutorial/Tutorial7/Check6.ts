import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Spectrum node is connected to the first input of the Switch node
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);
	
	// Find required nodes
	const spectrumNode = nodes.find(node => node.type === 'spectrum');
	const switchNode = nodes.find(node => node.type === 'switch');
	
	// Ensure both nodes exist
	if (!spectrumNode || !switchNode) {
		return false;
	}
	
	// Get the spectrum node's ID
	const spectrumNodeId = entries.find(entry => entry[1] === spectrumNode)?.[0];
	
	// Check if spectrum node is connected to switch node
	return switchNode.inputs.some(input => input.id === spectrumNodeId);
}
