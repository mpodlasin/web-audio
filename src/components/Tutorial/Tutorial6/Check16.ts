import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find required nodes
	const triangleOscillator = nodes.find((node) => node.type === 'triangle-oscillator');
	const spectrumNode = nodes.find((node) => node.type === 'spectrum');
	const outputNode = nodes.find((node) => node.type === 'destination');

	// Ensure all required nodes exist
	if (!triangleOscillator || !spectrumNode || !outputNode) {
		return false;
	}

	// Get the Triangle Oscillator's ID
	const triangleOscillatorId = entries.find((entry) => entry[1] === triangleOscillator)?.[0];

	// Check if Triangle Oscillator is connected to Spectrum
	const isConnected = spectrumNode.inputs.some((input) => input.id === triangleOscillatorId);

	return isConnected;
}
