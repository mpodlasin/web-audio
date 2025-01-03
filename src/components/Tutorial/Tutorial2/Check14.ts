import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Clock node and tempo was set to be exactly 15 BPM
	// Clock nose was connected to both Oscilloscope and Value nodes
	const clockNode = values.find((node) => node.type === 'clock');
	const oscilloscopeNode = values.find((node) => node.type === 'oscilloscope');
	const valueNode = values.find((node) => node.type === 'value');
	const clockNodeId = entries.find((entry) => entry[1] === clockNode)?.[0];

	const tempo = clockNode?.parameters?.tempo?.base ?? 0;
	const epsilon = 0.01;

	const clockIsConnectedToValue =
		valueNode?.inputs?.some((input) => input.id === clockNodeId) ?? false;
	const clockIsConnectedToOscilloscope =
		oscilloscopeNode?.inputs?.some((input) => input.id === clockNodeId) ?? false;

	return (
		clockIsConnectedToValue && clockIsConnectedToOscilloscope && Math.abs(tempo - 15) < epsilon
	);
}
