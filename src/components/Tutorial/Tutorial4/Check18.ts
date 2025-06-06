import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Sine Oscillator and Gain node have been removed.
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	const sineOscillator = nodes.find((node) => node.type === 'sine-oscillator');
	const gainNode = nodes.find((node) => node.type === 'gain');

	return !sineOscillator && !gainNode;
}
