import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// AD Envelope was connected to gain parameter of Gain node.

	const adEnvelopeNode = values.find((node) => node.type === 'ad-envelope');
	const adEnvelopeNodeId = entries.find((entry) => entry[1] === adEnvelopeNode)?.[0];

    const gainNode = values.find(node => node.type === 'gain');

	return gainNode?.parameters.gain?.inputs.some(input => input.id === adEnvelopeNodeId) ?? false;
}
