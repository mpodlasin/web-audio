import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Saw Oscillator's frequency is no longer 1 Hz.
export default function (audioGraph: SerializedAudioElements) {
	const sawOscillator = Object.values(audioGraph).find((node) => node.type === 'saw-oscillator');

	if (!sawOscillator) {
		return false;
	}

	// Check if the Saw Oscillator's frequency has been changed from 1 Hz
	const frequency = sawOscillator.parameters?.frequency?.base ?? 1;
	return frequency !== 1;
}
