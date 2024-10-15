import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Gate Length was deleted and AD Envelope node was created, while Clock still exists.
	const gateLengthNode = values.find((node) => node.type === 'gate-length');
	const gateLengthNodeWasDeleted = gateLengthNode === undefined;

    const clockNode = values.find((node) => node.type === 'clock');
	const clockNodeWasNotDeleted = clockNode !== undefined;

    const adEnvelopeNode = values.find((node) => node.type === 'ad-envelope');
    const adEnvelopeNodeWasCreated = adEnvelopeNode !== undefined;

    return gateLengthNodeWasDeleted && clockNodeWasNotDeleted && adEnvelopeNodeWasCreated;
}
