import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Saw Oscillator is connected to the Spectrum node
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);
	
	// Find required nodes
	const sawOscillator = nodes.find(node => node.type === 'saw-oscillator');
	const spectrumNode = nodes.find(node => node.type === 'spectrum');
	
	// Ensure both nodes exist
	if (!sawOscillator || !spectrumNode) {
		return false;
	}
	
	// Get the saw oscillator's ID
	const sawOscillatorId = entries.find(entry => entry[1] === sawOscillator)?.[0];
	
	// Check if saw oscillator is connected to spectrum node
	return spectrumNode.inputs.some(input => input.id === sawOscillatorId);
}
