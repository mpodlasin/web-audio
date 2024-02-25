import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Check that gain node was created:
	if (values.some((node) => node.type === 'gain')) {
		return true;
	}

	return false;
}
