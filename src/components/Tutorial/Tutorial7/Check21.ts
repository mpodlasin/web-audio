import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a sixth Sine Oscillator is created with frequency set to 2640 Hz (sixth harmonic)
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	
	// Find all sine oscillators - should have at least 6
	const sineOscillators = nodes.filter(node => node.type === 'sine-oscillator');
	if (sineOscillators.length < 6) {
		return false;
	}
	
	// Check if we have oscillators at all expected frequencies
	const has440HzOscillator = sineOscillators.some(osc => osc.parameters?.frequency?.base === 440);
	const has880HzOscillator = sineOscillators.some(osc => osc.parameters?.frequency?.base === 880);
	const has1320HzOscillator = sineOscillators.some(osc => osc.parameters?.frequency?.base === 1320);
	const has1760HzOscillator = sineOscillators.some(osc => osc.parameters?.frequency?.base === 1760);
	const has2200HzOscillator = sineOscillators.some(osc => osc.parameters?.frequency?.base === 2200);
	const has2640HzOscillator = sineOscillators.some(osc => osc.parameters?.frequency?.base === 2640);
	
	return has440HzOscillator && has880HzOscillator && has1320HzOscillator && 
		   has1760HzOscillator && has2200HzOscillator && has2640HzOscillator;
}
