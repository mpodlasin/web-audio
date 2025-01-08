import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Gain parameter on the Gain node was set to 0.
	const gainNode = values.find((node) => node.type === 'gain');

    return gainNode?.parameters.gain?.base === 0;
}
