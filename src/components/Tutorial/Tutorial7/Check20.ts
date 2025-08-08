import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a fourth Gain node is created with gain set to 0.2 (1/5 for fifth harmonic) and properly connected
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);
	
	// Find all gain nodes - should have exactly 4
	const gainNodes = nodes.filter(node => node.type === 'gain');
	if (gainNodes.length !== 4) {
		return false;
	}
	
	// Find the 2200 Hz oscillator and the 0.2 gain node
	const sineOscillators = nodes.filter(node => node.type === 'sine-oscillator');
	const sine2200 = sineOscillators.find(osc => osc.parameters?.frequency?.base === 2200);
	const fifthGain = gainNodes.find(gain => gain.parameters?.gain?.base === 0.2);
	const spectrumNodes = nodes.filter(node => node.type === 'spectrum');
	
	if (!sine2200 || !fifthGain || spectrumNodes.length !== 2) {
		return false;
	}
	
	// Get node IDs
	const sine2200Id = entries.find(entry => entry[1] === sine2200)?.[0];
	const fifthGainId = entries.find(entry => entry[1] === fifthGain)?.[0];
	
	// Check that 2200 Hz sine is connected to the 0.2 gain node
	const sineConnectedToGain = fifthGain.inputs.some(input => input.id === sine2200Id);
	
	// Find which spectrum node the saw oscillator is connected to (reference path)
	const sawOscillator = nodes.find(node => node.type === 'saw-oscillator');
	if (!sawOscillator) return false;
	
	const sawOscillatorId = entries.find(entry => entry[1] === sawOscillator)?.[0];
	const sawConnectedSpectrum = spectrumNodes.find(spectrumNode => 
		spectrumNode.inputs.some(input => input.id === sawOscillatorId)
	);
	
	if (!sawConnectedSpectrum) return false;
	
	// Find the OTHER spectrum node (synthesized path)
	const synthesizedSpectrum = spectrumNodes.find(spectrumNode => spectrumNode !== sawConnectedSpectrum);
	if (!synthesizedSpectrum) return false;
	
	// Check that the 0.2 gain node is connected to the SYNTHESIZED spectrum node (not the reference one)
	const gainConnectedToSynthesizedSpectrum = synthesizedSpectrum.inputs.some(input => input.id === fifthGainId);
	
	return sineConnectedToGain && gainConnectedToSynthesizedSpectrum;
}
