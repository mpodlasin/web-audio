import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Square Oscillator is connected to the Oscilloscope and its frequency is set to 1 Hz.
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	const squareOscillator = nodes.find((node) => node.type === 'square-oscillator');
	const oscilloscope = nodes.find((node) => node.type === 'oscilloscope');

	if (!squareOscillator || !oscilloscope) {
		return false;
	}

	// Ensure the Square Oscillator's frequency is set to 1 Hz
	const frequencyIsOneHz = squareOscillator.parameters?.frequency?.base === 1;

	// Check if the Square Oscillator is connected to the Oscilloscope
	const squareOscillatorId = entries.find((entry) => entry[1] === squareOscillator)?.[0];
	const isConnectedToOscilloscope = oscilloscope.inputs.some(
		(input) => input.id === squareOscillatorId
	);

	return frequencyIsOneHz && isConnectedToOscilloscope;
}
