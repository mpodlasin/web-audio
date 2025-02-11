import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the AD Envelope is connected to the Times node, the Times node is connected to the Triangle Oscillator,
// and the AD Envelope is no longer directly connected to the Triangle Oscillator.
export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	const adEnvelope = values.find((node) => node.type === 'ad-envelope');
	const timesNode = values.find((node) => node.type === 'times');
	const triangleOscillator = values.find((node) => node.type === 'triangle-oscillator');

	const adEnvelopeId = entries.find((entry) => entry[1] === adEnvelope)?.[0];
	const timesNodeId = entries.find((entry) => entry[1] === timesNode)?.[0];

	// Check if AD Envelope is connected to the Times node
	const adEnvelopeIsConnectedToTimes =
		timesNode?.inputs?.some((input) => input.id === adEnvelopeId) ?? false;

	// Check if Times node is connected to the Triangle Oscillator's frequency parameter
	const timesNodeIsConnectedToTriangle =
		triangleOscillator?.parameters?.frequency?.inputs?.some((input) => input.id === timesNodeId) ??
		false;

	// Check if AD Envelope is no longer directly connected to the Triangle Oscillator
	const adEnvelopeIsNotDirectlyConnectedToTriangle = !(
		triangleOscillator?.parameters?.frequency?.inputs?.some((input) => input.id === adEnvelopeId) ??
		false
	);

	return (
		(adEnvelope &&
			timesNode &&
			triangleOscillator &&
			adEnvelopeIsConnectedToTimes &&
			timesNodeIsConnectedToTriangle &&
			adEnvelopeIsNotDirectlyConnectedToTriangle) ??
		false
	);
}
