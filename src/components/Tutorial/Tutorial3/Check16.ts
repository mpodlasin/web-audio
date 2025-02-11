import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Saw LFO frequency is set close to 2 Hz.
export default function (audioGraph: SerializedAudioElements) {
	const sawLFO = Object.values(audioGraph).find((node) => node.type === 'saw-lfo');

	// Allow for a small tolerance around 2 Hz
	const isFrequencySetTo2Hz = Math.abs((sawLFO?.parameters?.frequency?.base ?? 0) - 2) < 0.005;

	return (sawLFO && isFrequencySetTo2Hz) ?? false;
}
