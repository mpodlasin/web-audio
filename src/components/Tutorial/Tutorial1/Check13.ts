import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Check that sequencer was connected to sine frequency knob
	const sequencerNode = values.find((node) => node.type === 'sequencer');
	const sineNode = values.find((node) => node.type === 'sine-oscillator');
	const sequencerNodeId = entries.find((entry) => entry[1] === sequencerNode)?.[0];

	return (
		sineNode?.parameters['frequency']?.inputs.some((input) => input.id === sequencerNodeId) ?? false
	);
}
