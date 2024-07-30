import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Number and Value nodes where disconnected and Sine was connected to Value.
	const numberNode = values.find((node) => node.type === 'number');
	const valueNode = values.find((node) => node.type === 'value');
	const sineNode = values.find((node) => node.type === 'sine-oscillator');

	const numberNodeId = entries.find((entry) => entry[1] === numberNode)?.[0];
	const sineNodeId = entries.find((entry) => entry[1] === sineNode)?.[0];

	const numberNodeWasDisconnectedFromValueNode =
		valueNode?.inputs?.every((input) => input.id !== numberNodeId) ?? false;
	const sineNodeWasConnectedToValueNode = 
		valueNode?.inputs?.some((input) => input.id === sineNodeId) ?? false;

	return numberNodeWasDisconnectedFromValueNode && sineNodeWasConnectedToValueNode;
}
