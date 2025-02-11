import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that an AD Envelope node is created.
export default function (audioGraph: SerializedAudioElements) {
	const adEnvelope = Object.values(audioGraph).find((node) => node.type === 'ad-envelope');

	return adEnvelope !== undefined;
}
