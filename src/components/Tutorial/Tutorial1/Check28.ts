import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Tempo property on Clock node was decreased to be below 70 BPM.

	const clockNode = values.find((node) => node.type === 'clock');
	const tempoProperty = clockNode?.parameters?.['tempo']?.base ?? 0;

	return tempoProperty <= 70;
}
