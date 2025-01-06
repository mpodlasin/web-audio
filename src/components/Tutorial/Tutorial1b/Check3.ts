import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Output node was created:
	if (values.some((node) => node.type === 'destination')) {
		return true;
	}

	return false;
}
