import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const entries = Object.entries(audioGraph);
	const values = Object.values(audioGraph);

	// Check that sine was connected to output:
	const sine = values.find((node) => node.type === 'sine-oscillator');
	const sineId = entries.find((entry) => entry[1] === sine)?.[0];
	const output = values.find((node) => node.type === 'destination');

	if (sine && output && sineId) {
		return output.inputs?.some((input) => input.id === sineId) ?? false;
	}

	return false;
}
