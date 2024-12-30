import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Clock was connected do AD Envelope and AD Envelope
	// was connected to Value and Oscilloscope
	const clockNode = values.find((node) => node.type === 'clock');
	const clockNodeId = entries.find((entry) => entry[1] === clockNode)?.[0];

	const adEnvelopeNode = values.find((node) => node.type === 'ad-envelope');
	const adEnvelopeNodeId = entries.find((entry) => entry[1] === adEnvelopeNode)?.[0];

	const valueNode = values.find((node) => node.type === 'value');
	const oscilloscopeNode = values.find((node) => node.type === 'oscilloscope');

	const adWasConnectedToValue = valueNode?.inputs?.some((input) => input.id === adEnvelopeNodeId);
	const adWasConnectedToOscilloscope = oscilloscopeNode?.inputs?.some(
		(input) => input.id === adEnvelopeNodeId
	);

	const clockWasConnectedToAd = adEnvelopeNode?.inputs?.some((input) => input.id === clockNodeId);

	return (clockWasConnectedToAd && adWasConnectedToValue && adWasConnectedToOscilloscope) ?? false;
}
