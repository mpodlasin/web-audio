import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Factor on Mult is exactly 0.5.
	const multNode = values.find((node) => node.type === 'multiply');
	const factor = multNode?.parameters?.factor.base ?? 0;

	const epsilon = 0.005;
	const target = 0.5;

	return target - epsilon < factor && factor < target + epsilon;
}
