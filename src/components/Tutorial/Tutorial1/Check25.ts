import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

    // Decay property on AD Envelope node was moved.

    const envelopeNode = values.find(node => node.type === 'ad-envelope');
    const decayProperty = envelopeNode?.parameters?.['decay'].base ?? 200;

    return decayProperty !== 200;
}
