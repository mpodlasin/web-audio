import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Gain node's gain parameter is set to exactly 0.5.
export default function (audioGraph: SerializedAudioElements) {
	const gainNode = Object.values(audioGraph).find((node) => node.type === 'gain');

	return gainNode?.parameters?.gain?.base === 0.5;
}
