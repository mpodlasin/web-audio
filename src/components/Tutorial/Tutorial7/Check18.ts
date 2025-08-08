import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a third Gain node is created with gain set to 0.25 (1/4 for fourth harmonic) and properly connected
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find all gain nodes - should have exactly 3
	const gainNodes = nodes.filter((node) => node.type === 'gain');
	if (gainNodes.length !== 3) {
		return false;
	}

	// Find the 1760 Hz oscillator and the 0.25 gain node
	const sineOscillators = nodes.filter((node) => node.type === 'sine-oscillator');
	const sine1760 = sineOscillators.find((osc) => osc.parameters?.frequency?.base === 1760);
	const fourthGain = gainNodes.find((gain) => gain.parameters?.gain?.base === 0.25);
	const spectrumNodes = nodes.filter((node) => node.type === 'spectrum');

	if (!sine1760 || !fourthGain || spectrumNodes.length !== 2) {
		return false;
	}

	// Get node IDs
	const sine1760Id = entries.find((entry) => entry[1] === sine1760)?.[0];
	const fourthGainId = entries.find((entry) => entry[1] === fourthGain)?.[0];

	// Check that 1760 Hz sine is connected to the 0.25 gain node
	const sineConnectedToGain = fourthGain.inputs.some((input) => input.id === sine1760Id);

	// Find which spectrum node the saw oscillator is connected to (reference path)
	const sawOscillator = nodes.find((node) => node.type === 'saw-oscillator');
	if (!sawOscillator) return false;

	const sawOscillatorId = entries.find((entry) => entry[1] === sawOscillator)?.[0];
	const sawConnectedSpectrum = spectrumNodes.find((spectrumNode) =>
		spectrumNode.inputs.some((input) => input.id === sawOscillatorId)
	);

	if (!sawConnectedSpectrum) return false;

	// Find the OTHER spectrum node (synthesized path)
	const synthesizedSpectrum = spectrumNodes.find(
		(spectrumNode) => spectrumNode !== sawConnectedSpectrum
	);
	if (!synthesizedSpectrum) return false;

	// Check that the 0.25 gain node is connected to the SYNTHESIZED spectrum node (not the reference one)
	const gainConnectedToSynthesizedSpectrum = synthesizedSpectrum.inputs.some(
		(input) => input.id === fourthGainId
	);

	return sineConnectedToGain && gainConnectedToSynthesizedSpectrum;
}
