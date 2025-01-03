import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const entries = Object.entries(audioGraph);
	const values = Object.values(audioGraph);

	// Check that gain.gain is not set to 0:
	if (values.some((node) => node.type === 'gain')) {
		const gain = values.find((node) => node.type === 'gain');
		const gainId = entries.find((entry) => entry[1] === gain)?.[0];

		if (gain && gainId) {
			return gain.parameters['gain']?.base !== 0;
		}
	}

	return false;
}
