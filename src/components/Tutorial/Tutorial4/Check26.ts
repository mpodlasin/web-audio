import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Square Oscillator is connected to the Output node and its frequency has changed from 1 Hz.
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	const squareOscillator = nodes.find((node) => node.type === 'square-oscillator');
	const outputNode = nodes.find((node) => node.type === 'destination');

	if (!squareOscillator || !outputNode) {
		return false;
	}

	// Check if the Square Oscillator's frequency has been changed from 1 Hz
	const frequency = squareOscillator.parameters?.frequency?.base ?? 1;
	const frequencyChanged = frequency !== 1;

	// Check if the Square Oscillator is connected to the Output node
	const squareOscillatorId = entries.find((entry) => entry[1] === squareOscillator)?.[0];
	const isConnectedToOutput = outputNode.inputs.some((input) => input.id === squareOscillatorId);

	return frequencyChanged && isConnectedToOutput;
}
