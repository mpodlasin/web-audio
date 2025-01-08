import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Convolution was added between Sine and Output

	const outputNode = values.find((node) => node.type === 'destination');
	const sineNode = values.find((node) => node.type === 'sine-oscillator');
	const sineNodeId = entries.find((entry) => entry[1] === sineNode)?.[0];
	const maybeConvolution = outputNode?.inputs
		?.map((input) => audioGraph[input.id])
		.filter((node) => node && node.type === 'convolution')[0];

	if (!sineNodeId) return false;
	if (!maybeConvolution) return false;

	return maybeConvolution.inputs?.some((input) => input.id === sineNodeId) ?? false;
}
