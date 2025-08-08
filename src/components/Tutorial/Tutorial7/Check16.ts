import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a second Gain node is created with gain set to 0.33 (1/3 for third harmonic) and properly connected
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find all gain nodes - should have at least 2
	const gainNodes = nodes.filter((node) => node.type === 'gain');
	if (gainNodes.length < 2) {
		return false;
	}

	// Find the 1320 Hz oscillator and the 0.33 gain node
	const sineOscillators = nodes.filter((node) => node.type === 'sine-oscillator');
	const sine1320 = sineOscillators.find((osc) => osc.parameters?.frequency?.base === 1320);
	const thirdGain = gainNodes.find((gain) => gain.parameters?.gain?.base === 0.33);
	const spectrumNodes = nodes.filter((node) => node.type === 'spectrum');

	if (!sine1320 || !thirdGain || spectrumNodes.length !== 2) {
		return false;
	}

	// Get node IDs
	const sine1320Id = entries.find((entry) => entry[1] === sine1320)?.[0];
	const thirdGainId = entries.find((entry) => entry[1] === thirdGain)?.[0];

	// Check that 1320 Hz sine is connected to the 0.33 gain node
	const sineConnectedToGain = thirdGain.inputs.some((input) => input.id === sine1320Id);

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

	// Check that the 0.33 gain node is connected to the SYNTHESIZED spectrum node (not the reference one)
	const gainConnectedToSynthesizedSpectrum = synthesizedSpectrum.inputs.some(
		(input) => input.id === thirdGainId
	);

	return sineConnectedToGain && gainConnectedToSynthesizedSpectrum;
}
