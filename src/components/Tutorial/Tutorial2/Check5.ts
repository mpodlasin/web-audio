import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Number node has value between -1 and 1.
	const numberNode = values.find((node) => node.type === 'number');
	const numberValue = numberNode?.parameters?.value?.base ?? 100;

	return -1 <= numberValue && numberValue <= 1;
}
