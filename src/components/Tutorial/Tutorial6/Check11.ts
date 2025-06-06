import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find the Spectrum node
	const spectrumNode = nodes.find((node) => node.type === 'spectrum');
	if (!spectrumNode) return false;

	// Check that we have at least 2 sine oscillators
	const sineOscillators = nodes.filter((node) => node.type === 'sine-oscillator');
	if (sineOscillators.length < 2) return false;

	// Check that at least one sine oscillator is connected directly to the spectrum
	// (the second one should be connected directly as per step 11 instructions)
	let directlyConnectedCount = 0;

	for (const sineOsc of sineOscillators) {
		const sineId = entries.find((entry) => entry[1] === sineOsc)?.[0];
		const directConnection = spectrumNode.inputs.some((input) => input.id === sineId);

		if (directConnection) {
			directlyConnectedCount++;
		}
	}

	// At least one sine oscillator should be connected directly to spectrum
	return directlyConnectedCount >= 1;
}
