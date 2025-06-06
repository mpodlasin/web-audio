import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that all four oscillators have their frequency parameters set to 0
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Find all oscillator nodes
	const sineOscillator = nodes.find((node) => node.type === 'sine-oscillator');
	const sawOscillator = nodes.find((node) => node.type === 'saw-oscillator');
	const squareOscillator = nodes.find((node) => node.type === 'square-oscillator');
	const triangleOscillator = nodes.find((node) => node.type === 'triangle-oscillator');

	// Ensure all nodes exist
	if (!sineOscillator || !sawOscillator || !squareOscillator || !triangleOscillator) {
		return false;
	}

	// Check if each oscillator's frequency parameter is set to 0
	const sineFreqIsZero = sineOscillator.parameters?.frequency?.base === 0;
	const sawFreqIsZero = sawOscillator.parameters?.frequency?.base === 0;
	const squareFreqIsZero = squareOscillator.parameters?.frequency?.base === 0;
	const triangleFreqIsZero = triangleOscillator.parameters?.frequency?.base === 0;

	return sineFreqIsZero && sawFreqIsZero && squareFreqIsZero && triangleFreqIsZero;
}
