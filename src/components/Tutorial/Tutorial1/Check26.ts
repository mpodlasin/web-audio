import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

    // Attack property on AD Envelope node was moved.

    const envelopeNode = values.find(node => node.type === 'ad-envelope');
    const attackProperty = envelopeNode?.parameters?.['attack'].base ?? 0;

    return attackProperty !== 0;
}
