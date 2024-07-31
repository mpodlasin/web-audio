import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Value parameter on Number was set between 50 and 60.
	const numberNode = values.find((node) => node.type === 'number');

    const numberValue = numberNode?.parameters?.value.base ?? 0;

    return 50 <= numberValue && numberValue <= 60;
}
