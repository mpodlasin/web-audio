import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Clock node and tempo was set to be around 15 BPM.
	const clockNode = values.find(node => node.type === 'clock');

    const tempo = clockNode?.parameters?.tempo.base ?? 0;
    const epsilon = 0.5;

    return Math.abs(tempo - 15) < epsilon;
}
