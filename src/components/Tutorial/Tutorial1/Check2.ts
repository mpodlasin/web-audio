import type { SerializedAudioElements } from '../../../audio/serialized';

export default function Tutorial1Check(audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Check that sine oscillator was created:
	if (values.some((node) => node.type === 'sine-oscillator')) {
		return true;
	}

	return false;
}
