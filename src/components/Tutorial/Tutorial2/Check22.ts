import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

	// Gate Length was connected to Sequencer and is still connected to Value.
	const sequencerNode = values.find((node) => node.type === 'sequencer');
    const gateLengthNode = values.find((node) => node.type === 'gate-length');
    const valueNode = values.find((node) => node.type === 'value');

    const gateLengthNodeId = entries.find(entry => entry[1] === gateLengthNode)?.[0];

    const gateLengthIsStillConnectedToValue = valueNode?.inputs?.some(input => input.id === gateLengthNodeId) ?? false;
    const gateLengthIsConnectedToSequencer = sequencerNode?.inputs?.some(input => input.id === gateLengthNodeId) ?? false;

	return gateLengthIsConnectedToSequencer && gateLengthIsStillConnectedToValue;
}
