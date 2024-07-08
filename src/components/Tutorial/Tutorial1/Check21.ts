import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Another gain node was created and was inserted between Sine and Convolution nodes.
	const gainNodes = values.filter((node) => node.type === 'gain');
	const thereAreTwoGainNodes = gainNodes.length == 2;

	const convolutionNode = values.find((node) => node.type === 'convolution');

	const gainConnectedToConvolution = convolutionNode?.inputs
		?.map((input) => (typeof input === 'string' ? input : input.id))
		.map((input) => audioGraph[input])
		.find((node) => node && node.type === 'gain');

	if (!gainConnectedToConvolution) return false;

	const sineWasConnectedToGainConnectedToConvolution =
		gainConnectedToConvolution.inputs
			?.map((input) => (typeof input === 'string' ? input : input.id))
			.map((input) => audioGraph[input])
			.some((node) => node && node.type === 'sine-oscillator') ?? false;

	return thereAreTwoGainNodes && sineWasConnectedToGainConnectedToConvolution;
}
