import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Tempo on Clock node is below 20 BPM
	const clockNode = values.find((node) => node.type === 'clock');

	const tempo = clockNode?.parameters?.tempo.base ?? 0;

	return tempo < 20;
}
