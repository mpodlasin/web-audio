import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

    // AD Envelope node was created.
    return values.some(node => node.type === 'ad-envelope');
}
