import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// AD Envelope was connected to gain parameter of Gain node
	// and gain knob on Gain connected to Convolution was set to 0

	const convolutionNode = values.find((node) => node.type === 'convolution');
	const gainConnectedToConvolution = convolutionNode?.inputs
		?.map((input) => audioGraph[input.id])
		.find((node) => node && node.type === 'gain');

	const adEnvelopeNode = values.find((node) => node.type === 'ad-envelope');
	const adEnvelopeNodeId = entries.find((entry) => entry[1] === adEnvelopeNode)?.[0];

	const adEnvelopeWasConnectedToGain =
		gainConnectedToConvolution?.parameters?.['gain']?.inputs.some(
			(input) => input.id === adEnvelopeNodeId
		) ?? false;

	const gainParameter = gainConnectedToConvolution?.parameters?.['gain']?.base ?? 0;

	return adEnvelopeWasConnectedToGain && gainParameter === 0;
}
