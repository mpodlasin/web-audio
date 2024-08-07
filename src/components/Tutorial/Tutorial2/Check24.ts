import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Sequencer was connected to Value and Gate Length is still connected as well.
	const sequencerNode = values.find((node) => node.type === 'sequencer');
	const valueNode = values.find((node) => node.type === 'value');
	const gateLengthNode = values.find((node) => node.type === 'gate-length');

	const sequencerNodeId = entries.find((entry) => entry[1] === sequencerNode)?.[0];
	const gateLengthNodeId = entries.find((entry) => entry[1] === gateLengthNode)?.[0];

	const sequencerIsConnectedToValue =
		valueNode?.inputs?.some((input) => input.id === sequencerNodeId) ?? false;

	const gateLengthIsStillConnectedToValue = valueNode?.inputs?.some((input) => input.id === gateLengthNodeId) ?? false;

	return sequencerIsConnectedToValue && gateLengthIsStillConnectedToValue;
}
