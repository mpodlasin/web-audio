import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

    // Attack parameter of the AD Envelope is exactly 500ms.
	const adEnvelopeNode = values.find(value => value.type === 'ad-envelope');

    const attack = adEnvelopeNode?.parameters?.attack.base ?? 0;

    return attack === 500;
}
