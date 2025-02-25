import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Sine Oscillator's frequency parameter is set to exactly 1 Hz.
export default function (audioGraph: SerializedAudioElements) {
	const sineNode = Object.values(audioGraph).find((node) => node.type === 'sine-oscillator');

	return sineNode?.parameters?.frequency?.base === 1;
}
