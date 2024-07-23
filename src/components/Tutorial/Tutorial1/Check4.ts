import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const entries = Object.entries(audioGraph);
	const values = Object.values(audioGraph);

	// Check that sine was connected to gain:
	if (values.some((node) => node.type === 'sine-oscillator')) {
		const sine = values.find((node) => node.type === 'sine-oscillator');
		const sineId = entries.find((entry) => entry[1] === sine)?.[0];
		const gain = values.find((node) => node.type === 'gain');

		if (sine && gain && sineId) {
			return gain.inputs?.some((input) => input.id === sineId) ?? false;
		}
	}

	return false;
}
