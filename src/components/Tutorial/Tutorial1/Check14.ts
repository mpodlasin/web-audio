import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

	// Trigger node was created and connected to Sequencer node
    const triggerNode = values.find(node => node.type === 'trigger');
    const sequencerNode = values.find(node => node.type === 'sequencer');
    const triggerNodeId = entries.find(entry => entry[1] === triggerNode)?.[0];

    if (triggerNode && sequencerNode && triggerNodeId) {
        return sequencerNode.inputs?.some(input => typeof input === 'string' ? input === triggerNodeId : input.id === triggerNodeId) ?? false;
    }

    return false;
}
