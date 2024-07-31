import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Sine frequency was set below 0.10 Hz.
	const sineNode = values.find((node) => node.type === 'sine-oscillator');

	return (sineNode?.parameters?.frequency.base ?? 0) <= 0.1;
}
