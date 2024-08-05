import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Length on Gate Length was decreased to be below 0.10 seconds;
	const gateLengthNode = values.find((node) => node.type === 'gate-length');

	return (gateLengthNode?.parameters?.length.base ?? 0) <= 0.1;
}
