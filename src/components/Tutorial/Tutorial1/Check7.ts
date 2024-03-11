import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const entries = Object.entries(audioGraph);
	const values = Object.values(audioGraph);

	// Check that gain was connected to destination:

	if (values.some((node) => node.type === 'gain')) {
		const gain = values.find((node) => node.type === 'gain');
		const gainId = entries.find((entry) => entry[1] === gain)?.[0];
		const destination = values.find((node) => node.type === 'destination');

		if (gain && destination && gainId) {
			return (
				destination.inputs?.some((input) => typeof input === 'object' && input.id === gainId) ??
				false
			);
		}
	}

	return false;
}
