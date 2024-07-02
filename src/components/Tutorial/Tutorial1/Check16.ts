import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

	// Line between Sequencer and Sine was removed
    const sequencerNode = values.find(node => node.type === 'sequencer');
    const sineNode = values.find(node => node.type === 'sine-oscillator');
    const sequencerNodeId = entries.find(entry => entry[1] === sequencerNode)?.[0];


    if (sequencerNode && sineNode && sequencerNodeId) {
        return sineNode.parameters?.['frequency'].inputs.every(input => input.id !== sequencerNodeId) ?? false;
    }

    return false;
}
