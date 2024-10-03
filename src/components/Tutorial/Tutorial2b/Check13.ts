import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Sine node was deleted.
	const sineNode = values.find(node => node.type === 'sine-oscillator');

    return sineNode === undefined;
}
