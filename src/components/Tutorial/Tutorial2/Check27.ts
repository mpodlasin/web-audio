import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Decay parameter of the AD Envelope is exactly 500ms.
	const adEnvelopeNode = values.find((value) => value.type === 'ad-envelope');

	const decay = adEnvelopeNode?.parameters?.decay?.base ?? 0;

	return decay === 500;
}
