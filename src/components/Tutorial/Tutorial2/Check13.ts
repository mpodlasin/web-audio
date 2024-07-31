import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Value parameter on Number was set between 50 and 60.
	const numberNode = values.find((node) => node.type === 'number');

    const numberValue = numberNode?.parameters?.value.base ?? 0;
	const epsilon = 0.01;
	const target = 50;

    return target - epsilon < numberValue && numberValue < target + epsilon;
}
