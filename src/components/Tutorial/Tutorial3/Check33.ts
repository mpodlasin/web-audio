import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the AD Envelope output is connected to the frequency parameter of the Triangle Oscillator.
export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	const adEnvelopeNode = values.find((node) => node.type === 'ad-envelope');
	const triangleOscillatorNode = values.find((node) => node.type === 'triangle-oscillator');

	const adEnvelopeNodeId = entries.find((entry) => entry[1] === adEnvelopeNode)?.[0];

	const adEnvelopeIsConnectedToFrequency =
		triangleOscillatorNode?.parameters?.frequency?.inputs.some(
			(input) => input.id === adEnvelopeNodeId
		) ?? false;

	return adEnvelopeIsConnectedToFrequency;
}
