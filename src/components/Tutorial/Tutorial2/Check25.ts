import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// All Sequencer values where changed to something different than 440Hz.
	const sequencerNode = values.find((node) => node.type === 'sequencer');

	const frequency1 = sequencerNode?.parameters?.frequency1.base ?? 0;
	const frequency2 = sequencerNode?.parameters?.frequency2.base ?? 0;
	const frequency3 = sequencerNode?.parameters?.frequency3.base ?? 0;
	const frequency4 = sequencerNode?.parameters?.frequency4.base ?? 0;
	const frequency5 = sequencerNode?.parameters?.frequency5.base ?? 0;
	const frequency6 = sequencerNode?.parameters?.frequency6.base ?? 0;
	const frequency7 = sequencerNode?.parameters?.frequency7.base ?? 0;
	const frequency8 = sequencerNode?.parameters?.frequency8.base ?? 0;

	return [
		frequency1,
		frequency2,
		frequency3,
		frequency4,
		frequency5,
		frequency6,
		frequency7,
		frequency8
	].every((frequency) => frequency !== 440);
}
