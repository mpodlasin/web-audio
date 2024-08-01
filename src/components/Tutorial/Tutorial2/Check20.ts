import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Length on Gate Length was increased above 2 seconds.
	const gateLengthNode = values.find((node) => node.type === 'gate-length');

	return (gateLengthNode?.parameters?.length.base ?? 0) > 2;
}
