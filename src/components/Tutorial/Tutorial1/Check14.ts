import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Clock node was created and connected to Sequencer node
	const clockNode = values.find((node) => node.type === 'clock');
	const sequencerNode = values.find((node) => node.type === 'sequencer');
	const clockNodeId = entries.find((entry) => entry[1] === clockNode)?.[0];

	if (clockNode && sequencerNode && clockNodeId) {
		return sequencerNode.inputs?.some((input) => input.id === clockNodeId) ?? false;
	}

	return false;
}
