import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a fifth Gain node is created with gain set to 0.167 (1/6 for sixth harmonic) and properly connected
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find all gain nodes - should have exactly 5
	const gainNodes = nodes.filter((node) => node.type === 'gain');
	if (gainNodes.length !== 5) {
		return false;
	}

	// Find the 2640 Hz oscillator and the 0.167 gain node
	const sineOscillators = nodes.filter((node) => node.type === 'sine-oscillator');
	const sine2640 = sineOscillators.find((osc) => osc.parameters?.frequency?.base === 2640);
	const sixthGain = gainNodes.find((gain) => gain.parameters?.gain?.base === 0.167);
	const spectrumNodes = nodes.filter((node) => node.type === 'spectrum');

	if (!sine2640 || !sixthGain || spectrumNodes.length !== 2) {
		return false;
	}

	// Get node IDs
	const sine2640Id = entries.find((entry) => entry[1] === sine2640)?.[0];
	const sixthGainId = entries.find((entry) => entry[1] === sixthGain)?.[0];

	// Check that 2640 Hz sine is connected to the 0.167 gain node
	const sineConnectedToGain = sixthGain.inputs.some((input) => input.id === sine2640Id);

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

	// Check that the 0.167 gain node is connected to the SYNTHESIZED spectrum node (not the reference one)
	const gainConnectedToSynthesizedSpectrum = synthesizedSpectrum.inputs.some(
		(input) => input.id === sixthGainId
	);

	return sineConnectedToGain && gainConnectedToSynthesizedSpectrum;
}
