import type { SerializedAudioElements } from '../../../audio/serialized';

// Verifies that the decay parameter of the AD Envelope is set to 60 ms.
export default function (audioGraph: SerializedAudioElements) {
	const adEnvelope = Object.values(audioGraph).find((node) => node.type === 'ad-envelope');

	return adEnvelope?.parameters?.decay?.base === 60;
}
