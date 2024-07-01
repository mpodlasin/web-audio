import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Check that oscillators frequency was changed from default 440Hz
    const sineNode = values.find(node => node.type === 'sine-oscillator');
    const frequencyParameter = sineNode?.parameters?.['frequency'].base ?? 440;

    return frequencyParameter !== 440;
}
