import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

	// Sequencer was connected to Value
	const sequencerNode = values.find((node) => node.type === 'sequencer');
    const valueNode = values.find((node) => node.type === 'value');

    const sequencerNodeId = entries.find(entry => entry[1] === sequencerNode)?.[0];

    const sequencerIsConnectedToValue = valueNode?.inputs?.some(input => input.id === sequencerNodeId) ?? false;

	return sequencerIsConnectedToValue;
}
