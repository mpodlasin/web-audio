import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Length on Gate Length was increased above 2 seconds.
	const sequencerNode = values.find((node) => node.type === 'sequencer');

	return sequencerNode !== undefined;
}
