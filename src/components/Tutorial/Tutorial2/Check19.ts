import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Tempo on Clock node is below 20 BPM
	const gateLengthNode = values.find((node) => node.type === 'gate-length');

	return gateLengthNode !== undefined;
}
