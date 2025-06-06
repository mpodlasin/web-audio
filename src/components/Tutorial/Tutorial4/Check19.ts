import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Triangle Oscillator exists, its frequency is set to 1 Hz, and it's connected to the Oscilloscope.
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	const triangleOscillator = nodes.find((node) => node.type === 'triangle-oscillator');
	const oscilloscope = nodes.find((node) => node.type === 'oscilloscope');

	if (!triangleOscillator || !oscilloscope) {
		return false;
	}

	// Ensure the Triangle Oscillator frequency is set to 1 Hz
	const frequencyIsOneHz = triangleOscillator.parameters?.frequency?.base === 1;

	// Check if the Triangle Oscillator is connected to the Oscilloscope
	const triangleOscillatorId = entries.find((entry) => entry[1] === triangleOscillator)?.[0];
	const isConnectedToOscilloscope = oscilloscope.inputs.some(
		(input) => input.id === triangleOscillatorId
	);

	return frequencyIsOneHz && isConnectedToOscilloscope;
}
