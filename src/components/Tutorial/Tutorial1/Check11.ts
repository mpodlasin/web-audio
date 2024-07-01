import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const entries = Object.entries(audioGraph);
	const values = Object.values(audioGraph);

    // Frequency of sine node is droped down below 2 Hz.

    const sineNode = values.find(node => node.type === 'sine-oscillator');

    const frequencyValue = sineNode?.parameters?.['frequency']?.base ?? 0;

    return frequencyValue < 2;
}
