import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Triangle Oscillator has been removed and a Square Oscillator has been created.
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	const triangleOscillator = nodes.find((node) => node.type === 'triangle-oscillator');
	const squareOscillator = nodes.find((node) => node.type === 'square-oscillator');

	const triangleOscillatorRemoved = !triangleOscillator;
	const squareOscillatorCreated = !!squareOscillator;

	return triangleOscillatorRemoved && squareOscillatorCreated;
}
