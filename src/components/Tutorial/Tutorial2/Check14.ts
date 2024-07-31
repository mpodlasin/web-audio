import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Sequencer node was created.
	const sequencerNode = values.find((node) => node.type === 'sequencer');

    return sequencerNode !== undefined;
}
