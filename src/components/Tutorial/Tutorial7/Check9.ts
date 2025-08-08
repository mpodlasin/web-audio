import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Sine Oscillator is created and connected to a different Spectrum node than the Saw Oscillator
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find required nodes
	const sawOscillator = nodes.find((node) => node.type === 'saw-oscillator');
	const sineOscillator = nodes.find((node) => node.type === 'sine-oscillator');
	const spectrumNodes = nodes.filter((node) => node.type === 'spectrum');

	// Ensure we have the required nodes
	if (!sawOscillator || !sineOscillator || spectrumNodes.length !== 2) {
		return false;
	}

	// Get node IDs
	const sawOscillatorId = entries.find((entry) => entry[1] === sawOscillator)?.[0];
	const sineOscillatorId = entries.find((entry) => entry[1] === sineOscillator)?.[0];

	// Find which spectrum node the saw oscillator is connected to
	const sawConnectedSpectrum = spectrumNodes.find((spectrumNode) =>
		spectrumNode.inputs.some((input) => input.id === sawOscillatorId)
	);

	if (!sawConnectedSpectrum) {
		return false; // Saw should be connected to a spectrum by this step
	}

	// Find the OTHER spectrum node (the one NOT connected to saw)
	const otherSpectrum = spectrumNodes.find((spectrumNode) => spectrumNode !== sawConnectedSpectrum);

	if (!otherSpectrum) {
		return false;
	}

	// Check that the sine oscillator is connected to the OTHER spectrum node
	const sineConnectedToOtherSpectrum = otherSpectrum.inputs.some(
		(input) => input.id === sineOscillatorId
	);

	return sineConnectedToOtherSpectrum;
}
