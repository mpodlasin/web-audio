import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Sine frequency is set to 0;
	const sineNode = values.find((node) => node.type === 'sine-oscillator');
	const frequencyParameter = sineNode?.parameters?.['frequency']?.base ?? 440;

	return frequencyParameter === 0;
}
