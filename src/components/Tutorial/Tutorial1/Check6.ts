import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Check that destination node was created:
	return values.some((node) => node.type === 'destination');
}
