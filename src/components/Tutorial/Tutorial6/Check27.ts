import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Square Oscillator has been removed and a Saw Oscillator has been created and connected to the Spectrum node
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Check that square oscillator is removed
	const squareOscillator = nodes.find((node) => node.type === 'square-oscillator');

	// Find required nodes
	const sawOscillator = nodes.find((node) => node.type === 'saw-oscillator');
	const spectrumNode = nodes.find((node) => node.type === 'spectrum');

	// Ensure square is removed, saw and spectrum exist
	if (squareOscillator || !sawOscillator || !spectrumNode) {
		return false;
	}

	// Get the Saw Oscillator's ID
	const sawOscillatorId = entries.find((entry) => entry[1] === sawOscillator)?.[0];

	// Check if Saw Oscillator is connected to Spectrum
	const isConnected = spectrumNode.inputs.some((input) => input.id === sawOscillatorId);

	return isConnected;
}
