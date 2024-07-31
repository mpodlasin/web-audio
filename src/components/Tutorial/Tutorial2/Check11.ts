import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Factor on Mult was set to be below 0.5
	const multNode = values.find((node) => node.type === 'multiply');

    return (multNode?.parameters?.factor.base ?? 0) <= 0.5;
}
