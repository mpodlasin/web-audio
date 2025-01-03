import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Length parameter on gate length node is equal to 0.25.
	const gateLengthNode = values.find((node) => node.type === 'gate-length');

	const lengthParameter = gateLengthNode?.parameters?.length?.base ?? 0;
	const epsilon = 0.005;

	return Math.abs(lengthParameter - 0.25) < epsilon;
}
