import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Gain node wass inserted between Sine and Convolution nodes.
	const gainNode = values.find((node) => node.type === 'gain');
	const gainNodeId = entries.find((entry) => entry[1] === gainNode)?.[0];

	const sineNode = values.find((node) => node.type === 'sine-oscillator');
	const sineNodeId = entries.find((entry) => entry[1] === sineNode)?.[0];

	const convolutionNode = values.find((node) => node.type === 'convolution');

	const gainConnectedToConvolution = convolutionNode?.inputs?.some(
		(input) => input.id === gainNodeId
	);

	const sineWasConnectedToGain = gainNode?.inputs?.some((input) => input.id === sineNodeId);

	return (sineWasConnectedToGain && gainConnectedToConvolution) ?? false;
}
