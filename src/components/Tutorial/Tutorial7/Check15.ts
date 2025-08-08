import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a third Sine Oscillator is created with frequency set to 1320 Hz (third harmonic)
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	
	// Find all sine oscillators - should have at least 3
	const sineOscillators = nodes.filter(node => node.type === 'sine-oscillator');
	if (sineOscillators.length < 3) {
		return false;
	}
	
	// Check if we have oscillators at the expected frequencies
	const has440HzOscillator = sineOscillators.some(osc => osc.parameters?.frequency?.base === 440);
	const has880HzOscillator = sineOscillators.some(osc => osc.parameters?.frequency?.base === 880);
	const has1320HzOscillator = sineOscillators.some(osc => osc.parameters?.frequency?.base === 1320);
	
	return has440HzOscillator && has880HzOscillator && has1320HzOscillator;
}
