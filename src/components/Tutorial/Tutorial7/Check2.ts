import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Saw Oscillator and a Spectrum node have been created
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Check for Saw Oscillator
	const hasSawOscillator = nodes.some((node) => node.type === 'saw-oscillator');

	// Check for Spectrum node
	const hasSpectrum = nodes.some((node) => node.type === 'spectrum');

	// Both nodes must exist
	return hasSawOscillator && hasSpectrum;
}
