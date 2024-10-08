import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Sine frequency is below 0.10 Hz, but above 0.05 Hz.
	const sineNode = values.find((node) => node.type === 'sine-oscillator');

	const frequency = sineNode?.parameters?.frequency.base ?? 0;

	return frequency < 0.1 && frequency > 0.05;
}
