import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Pitch Quantizer is connected to the frequency parameter of all four oscillators
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find all required nodes
	const pitchQuantizerNode = nodes.find((node) => node.type === 'pitch-quantizer');
	const sineOscillator = nodes.find((node) => node.type === 'sine-oscillator');
	const sawOscillator = nodes.find((node) => node.type === 'saw-oscillator');
	const squareOscillator = nodes.find((node) => node.type === 'square-oscillator');
	const triangleOscillator = nodes.find((node) => node.type === 'triangle-oscillator');

	// Ensure all nodes exist
	if (
		!pitchQuantizerNode ||
		!sineOscillator ||
		!sawOscillator ||
		!squareOscillator ||
		!triangleOscillator
	) {
		return false;
	}

	// Get the Pitch Quantizer ID
	const pitchQuantizerId = entries.find((entry) => entry[1] === pitchQuantizerNode)?.[0];

	// Check if the Pitch Quantizer is connected to each oscillator's frequency parameter
	const connectedToSine =
		sineOscillator.parameters?.frequency?.inputs.some((input) => input.id === pitchQuantizerId) ??
		false;

	const connectedToSaw =
		sawOscillator.parameters?.frequency?.inputs.some((input) => input.id === pitchQuantizerId) ??
		false;

	const connectedToSquare =
		squareOscillator.parameters?.frequency?.inputs.some((input) => input.id === pitchQuantizerId) ??
		false;

	const connectedToTriangle =
		triangleOscillator.parameters?.frequency?.inputs.some(
			(input) => input.id === pitchQuantizerId
		) ?? false;

	return connectedToSine && connectedToSaw && connectedToSquare && connectedToTriangle;
}
