import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Check that oscilloscope node was created
	if (values.some((node) => node.type === 'oscilloscope')) {
        return true;
    }

    return false;
}
