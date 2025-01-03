import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Sequencer is connected to Pitch Quantizer and Pitch Quantizer is connected to frequency of Sine.
	const sequencerNode = values.find((node) => node.type === 'sequencer');
	const sineNode = values.find((node) => node.type === 'sine-oscillator');
	const pitchQuantizerNode = values.find((node) => node.type === 'pitch-quantizer');
	const sequencerNodeId = entries.find((entry) => entry[1] === sequencerNode)?.[0];
	const pitchQuantizerNodeId = entries.find((entry) => entry[1] === pitchQuantizerNode)?.[0];

	if (sequencerNode && sineNode && pitchQuantizerNode && sequencerNodeId && pitchQuantizerNodeId) {
		const sequencerIsConnectedToQuantizer =
			pitchQuantizerNode.inputs?.some((input) => input.id === sequencerNodeId) ?? false;
		const quantizerIsConnectedToSine =
			sineNode.parameters?.['frequency']?.inputs.some(
				(input) => input.id === pitchQuantizerNodeId
			) ?? false;

		return sequencerIsConnectedToQuantizer && quantizerIsConnectedToSine;
	}

	return false;
}
