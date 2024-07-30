import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Sine node was created.
	return values.some((node) => node.type === 'sine-oscillator');
}
