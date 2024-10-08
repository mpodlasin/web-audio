import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Gate Length node was created.

    const gateLengthNode = values.find(node => node.type === 'gate-length');

	return gateLengthNode !== undefined;
}
