import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that notes have been selected on the Pitch Quantizer and frequencies adjusted on the Sequencer
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Find the Pitch Quantizer and Sequencer nodes
	const pitchQuantizer = nodes.find((node) => node.type === 'pitch-quantizer');
	const sequencer = nodes.find((node) => node.type === 'sequencer');

	// If either node doesn't exist, validation fails
	if (!pitchQuantizer || !sequencer) {
		return false;
	}

	// Check if at least 3 notes are selected on the Pitch Quantizer
	const noteParameters = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
	const enabledNotes = noteParameters.filter(
		(note) => pitchQuantizer.parameters?.[note]?.base === 1
	).length;

	// Check if at least 3 frequency parameters on the Sequencer have been changed
	const frequencyParameters = [
		'frequency1',
		'frequency2',
		'frequency3',
		'frequency4',
		'frequency5',
		'frequency6',
		'frequency7',
		'frequency8'
	];
	const changedFrequencies = frequencyParameters.filter(
		(param) => sequencer.parameters?.[param]?.base !== 440
	).length;

	// Validation passes if at least 3 notes are selected and at least 3 frequencies are changed
	return enabledNotes >= 3 && changedFrequencies >= 3;
}
