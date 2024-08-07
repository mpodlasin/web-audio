import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Sine frequency was set below 0.10 Hz, but higher than zero.
	const sineNode = values.find((node) => node.type === 'sine-oscillator');

	const frequency = sineNode?.parameters?.frequency.base ?? 0;

	return 0.005 < frequency && frequency <= 0.1;
}
