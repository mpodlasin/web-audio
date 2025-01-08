import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Attack property on AD Envelope node was increased to be above 70ms.

	const envelopeNode = values.find((node) => node.type === 'ad-envelope');
	const attackProperty = envelopeNode?.parameters['attack']?.base ?? 0;

	return attackProperty > 70;
}
