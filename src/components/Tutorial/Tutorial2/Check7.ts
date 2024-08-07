import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Gain node was created and inserted between Sine and Value nodes,
	// and connection from Sine to Value was removed
	const gainNode = values.find((node) => node.type === 'gain');
	const sineNode = values.find((node) => node.type === 'sine-oscillator');
	const valueNode = values.find((node) => node.type === 'value');

	const gainNodeId = entries.find((entry) => entry[1] === gainNode)?.[0];
	const sineNodeId = entries.find((entry) => entry[1] === sineNode)?.[0];

	const gainNodeExists = gainNode !== undefined;

	const gainNodeWasConnectedtoValue =
		valueNode?.inputs?.some((input) => input.id === gainNodeId) ?? false;
	const sineNodeWasConnectedToGain =
		gainNode?.inputs?.some((input) => input.id === sineNodeId) ?? false;

	const sineWasDisconnectedFromValue = valueNode?.inputs?.every((input) => input.id !== sineNodeId);

	return (
		gainNodeExists &&
		gainNodeWasConnectedtoValue &&
		sineNodeWasConnectedToGain &&
		sineWasDisconnectedFromValue
	);
}
