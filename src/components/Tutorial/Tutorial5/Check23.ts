import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that:
// 1. Sequencer and Pitch Quantizer nodes exist
// 2. Clock is connected to Sequencer
// 3. Sequencer is connected to Pitch Quantizer
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find all required nodes
	const clockNode = nodes.find((node) => node.type === 'clock');
	const sequencerNode = nodes.find((node) => node.type === 'sequencer');
	const pitchQuantizerNode = nodes.find((node) => node.type === 'pitch-quantizer');

	// Ensure all nodes exist
	if (!clockNode || !sequencerNode || !pitchQuantizerNode) {
		return false;
	}

	// Get node IDs
	const clockId = entries.find((entry) => entry[1] === clockNode)?.[0];
	const sequencerId = entries.find((entry) => entry[1] === sequencerNode)?.[0];

	// Check connections
	const clockConnectedToSequencer = sequencerNode.inputs.some((input) => input.id === clockId);
	const sequencerConnectedToQuantizer = pitchQuantizerNode.inputs.some(
		(input) => input.id === sequencerId
	);

	return clockConnectedToSequencer && sequencerConnectedToQuantizer;
}
