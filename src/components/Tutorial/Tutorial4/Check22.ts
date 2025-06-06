import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Output node's volume is nonzero and the Triangle Oscillator's frequency has changed from 1 Hz.
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	const triangleOscillator = nodes.find((node) => node.type === 'triangle-oscillator');
	const outputNode = nodes.find((node) => node.type === 'destination');

	if (!triangleOscillator || !outputNode) {
		return false;
	}

	// Check if the frequency of the Triangle Oscillator has been changed from 1 Hz
	const frequency = triangleOscillator.parameters?.frequency?.base ?? 1;
	const frequencyChanged = frequency !== 1;

	// Check if the Output node's volume is greater than zero
	const volume = outputNode.parameters?.volume?.base ?? 0;
	const volumeIsNonZero = volume > 0;

	return frequencyChanged && volumeIsNonZero;
}
