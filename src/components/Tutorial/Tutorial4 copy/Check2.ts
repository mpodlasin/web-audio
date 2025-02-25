import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Sine Oscillator is connected to a Gain node, which is then connected to an Oscilloscope.
export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	const sineNode = values.find((node) => node.type === 'sine-oscillator');
	const gainNode = values.find((node) => node.type === 'gain');
	const oscilloscopeNode = values.find((node) => node.type === 'oscilloscope');

	const sineNodeId = entries.find((entry) => entry[1] === sineNode)?.[0];
	const gainNodeId = entries.find((entry) => entry[1] === gainNode)?.[0];

	// Check if the Sine Oscillator is connected to the Gain node
	const sineConnectedToGain = gainNode?.inputs?.some((input) => input.id === sineNodeId) ?? false;

	// Check if the Gain node is connected to the Oscilloscope
	const gainConnectedToOscilloscope =
		oscilloscopeNode?.inputs?.some((input) => input.id === gainNodeId) ?? false;

	return (
		(sineNode &&
			gainNode &&
			oscilloscopeNode &&
			sineConnectedToGain &&
			gainConnectedToOscilloscope) ??
		false
	);
}
