import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Gain node was deleted;
	const gainNode = values.find((node) => node.type === 'gain');

	return gainNode === undefined;
}
