import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the AD Envelope is connected to the Oscilloscope and the Saw LFO is disconnected from it.
export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	const sawLFO = values.find((node) => node.type === 'saw-lfo');
	const adEnvelope = values.find((node) => node.type === 'ad-envelope');
	const oscilloscope = values.find((node) => node.type === 'oscilloscope');
	const adEnvelopeId = entries.find((entry) => entry[1] === adEnvelope)?.[0];
	const sawLFOId = entries.find((entry) => entry[1] === sawLFO)?.[0];

	// Check if AD Envelope is connected to the Oscilloscope
	const adEnvelopeIsConnectedToOscilloscope =
		oscilloscope?.inputs?.some((input) => input.id === adEnvelopeId) ?? false;

	// Check if Saw LFO is disconnected from the Oscilloscope
	const sawLFOIsDisconnectedFromOscilloscope = !(
		oscilloscope?.inputs?.some((input) => input.id === sawLFOId) ?? false
	);

	return (
		adEnvelope &&
		oscilloscope &&
		adEnvelopeIsConnectedToOscilloscope &&
		sawLFOIsDisconnectedFromOscilloscope
	);
}
