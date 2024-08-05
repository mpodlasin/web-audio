import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Length on Gate Length was set to 1 second
	const gateLengthNode = values.find((node) => node.type === 'gate-length');

    const length = gateLengthNode?.parameters?.length.base ?? 0;
    const epsilon = 0.005;
    const target = 1;

	return target - epsilon < length && length < target + epsilon;
}
