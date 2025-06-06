import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Triangle Oscillator's frequency has been changed from default (440 Hz)
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Find the Triangle Oscillator
	const triangleOscillator = nodes.find((node) => node.type === 'triangle-oscillator');
	if (!triangleOscillator) return false;

	// Check if frequency has been changed from default (440 Hz)
	const frequency = triangleOscillator.parameters?.frequency?.base ?? 440;
	return frequency !== 440;
}
