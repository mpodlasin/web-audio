import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Check that all frequencies of sequencer are different than default 440Hz

	const sequencerNode = values.find((node) => node.type === 'sequencer');

	const freq1 = sequencerNode?.parameters['frequency1']?.base ?? 440;
	const freq2 = sequencerNode?.parameters['frequency2']?.base ?? 440;
	const freq3 = sequencerNode?.parameters['frequency3']?.base ?? 440;
	const freq4 = sequencerNode?.parameters['frequency4']?.base ?? 440;
	const freq5 = sequencerNode?.parameters['frequency5']?.base ?? 440;
	const freq6 = sequencerNode?.parameters['frequency6']?.base ?? 440;
	const freq7 = sequencerNode?.parameters['frequency7']?.base ?? 440;
	const freq8 = sequencerNode?.parameters['frequency8']?.base ?? 440;

	return [freq1, freq2, freq3, freq4, freq5, freq6, freq7, freq8].every((freq) => freq !== 440);
}
