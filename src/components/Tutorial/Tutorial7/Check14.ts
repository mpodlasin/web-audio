import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the 880 Hz Sine Oscillator is connected to the Gain node, and the Gain node is connected to the synthesized spectrum node (not the reference one)
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find required nodes
	const sawOscillator = nodes.find((node) => node.type === 'saw-oscillator');
	const sineOscillators = nodes.filter((node) => node.type === 'sine-oscillator');
	const gainNodes = nodes.filter((node) => node.type === 'gain');
	const spectrumNodes = nodes.filter((node) => node.type === 'spectrum');

	// Find the 880 Hz oscillator and 0.5 gain node
	const sine880 = sineOscillators.find((osc) => osc.parameters?.frequency?.base === 880);
	const halfGain = gainNodes.find((gain) => gain.parameters?.gain?.base === 0.5);

	if (!sawOscillator || !sine880 || !halfGain || spectrumNodes.length !== 2) {
		return false;
	}

	// Get node IDs
	const sawOscillatorId = entries.find((entry) => entry[1] === sawOscillator)?.[0];
	const sine880Id = entries.find((entry) => entry[1] === sine880)?.[0];
	const halfGainId = entries.find((entry) => entry[1] === halfGain)?.[0];

	// Find which spectrum node the saw oscillator is connected to (reference path)
	const sawConnectedSpectrum = spectrumNodes.find((spectrumNode) =>
		spectrumNode.inputs.some((input) => input.id === sawOscillatorId)
	);

	if (!sawConnectedSpectrum) {
		return false;
	}

	// Find the OTHER spectrum node (synthesized path)
	const synthesizedSpectrum = spectrumNodes.find(
		(spectrumNode) => spectrumNode !== sawConnectedSpectrum
	);

	if (!synthesizedSpectrum) {
		return false;
	}

	// Check that 880 Hz sine is connected to the gain node
	const sineConnectedToGain = halfGain.inputs.some((input) => input.id === sine880Id);

	// Check that gain node is connected to the SYNTHESIZED spectrum node (not the reference one)
	const gainConnectedToSynthesizedSpectrum = synthesizedSpectrum.inputs.some(
		(input) => input.id === halfGainId
	);

	return sineConnectedToGain && gainConnectedToSynthesizedSpectrum;
}
