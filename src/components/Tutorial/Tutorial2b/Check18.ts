import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Length parameter on gate length node is around 0.5 s.
	const gateLengthNode = values.find((node) => node.type === 'gate-length');

	const lengthParameter = gateLengthNode?.parameters?.length.base ?? 0;
    const epsilon = 0.005;

    return Math.abs(lengthParameter - 0.5) < epsilon;
}
