import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that we have two Sine Oscillators: one at 440 Hz and one at 880 Hz
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Find all sine oscillators - should have at least 2
	const sineOscillators = nodes.filter((node) => node.type === 'sine-oscillator');
	if (sineOscillators.length < 2) {
		return false;
	}

	// Check if we have one oscillator at 440 Hz (fundamental)
	const has440HzOscillator = sineOscillators.some(
		(oscillator) => oscillator.parameters?.frequency?.base === 440
	);

	// Check if we have one oscillator at 880 Hz (second harmonic)
	const has880HzOscillator = sineOscillators.some(
		(oscillator) => oscillator.parameters?.frequency?.base === 880
	);

	return has440HzOscillator && has880HzOscillator;
}
