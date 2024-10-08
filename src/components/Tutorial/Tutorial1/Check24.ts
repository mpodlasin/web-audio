import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Clock was connected to AD envelope.
	const adEnvelopeNode = values.find((node) => node.type === 'ad-envelope');

	const clockWasConnectedToAdEnvelope =
		adEnvelopeNode?.inputs
			?.map((input) => audioGraph[input.id])
			.some((node) => node && node.type === 'clock') ?? false;

	return clockWasConnectedToAdEnvelope;
}
