import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Number node has value 0.
	const numberNode = values.find((node) => node.type === 'number');
	const numberValue = numberNode?.parameters?.value?.base ?? 100;
	const epsilon = 0.005;

	return Math.abs(numberValue - 0) < epsilon;
}
