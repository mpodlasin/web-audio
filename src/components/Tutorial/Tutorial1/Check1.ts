import type { SerializedAudioElements } from '../../../audio/serialized';

export default function Tutorial1Check(audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	for (const value of values) {
		if (value.type === 'sine-oscillator') {
			return true;
		}
	}

	return false;
}
