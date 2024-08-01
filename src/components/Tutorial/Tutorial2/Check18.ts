import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Gate Length was inserted between Clock and Value, Clock was disconnected from Value, Gate Length was set to 0.2s.
	const gateLengthNode = values.find((node) => node.type === 'gate-length');
	const clockNode = values.find((node) => node.type === 'clock');
	const valueNode = values.find((node) => node.type === 'value');

	const gateLengthNodeId = entries.find((entry) => entry[1] === gateLengthNode)?.[0];
	const clockNodeId = entries.find((entry) => entry[1] === clockNode)?.[0];

	const gateLengthWasConnectedToValue =
		valueNode?.inputs?.some((input) => input.id === gateLengthNodeId) ?? false;
	const clockWasConnectedToGateLength =
		gateLengthNode?.inputs?.some((input) => input.id === clockNodeId) ?? false;

	const clockWasDisconnectedFromValue =
		valueNode?.inputs?.every((input) => input.id !== clockNodeId) ?? false;

	const gateLength = gateLengthNode?.parameters?.length.base ?? 0;
	const epsilon = 0.005;
	const target = 0.2;
	const gateLengthHasProperValue = target - epsilon < gateLength && gateLength < target + epsilon;

	return (
		gateLengthWasConnectedToValue &&
		clockWasConnectedToGateLength &&
		clockWasDisconnectedFromValue &&
		gateLengthHasProperValue
	);
}
