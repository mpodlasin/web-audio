import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Number node was deleted.
	const numberNode = values.find(node => node.type === 'number');

    return numberNode === undefined;
}
