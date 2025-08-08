import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that Number node is set to 440 and connected to first sine oscillator frequency
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);
	
	// Find the number node with value 440
	const numberNodes = nodes.filter(node => node.type === 'number');
	const number440 = numberNodes.find(num => num.parameters?.value?.base === 440);
	
	if (!number440) return false;
	
	// Find the first sine oscillator (440 Hz fundamental)
	const sineOscillators = nodes.filter(node => node.type === 'sine-oscillator');
	const fundamentalSine = sineOscillators.find(osc => osc.parameters?.frequency?.base === 440);
	
	if (!fundamentalSine) return false;
	
	// Get number node ID
	const number440Id = entries.find(entry => entry[1] === number440)?.[0];
	
	// Check that number node is connected to sine oscillator frequency parameter
	const numberConnectedToFreq = fundamentalSine.parameters?.frequency?.inputs.some(
		input => input.id === number440Id
	) ?? false;
	
	return numberConnectedToFreq;
}
