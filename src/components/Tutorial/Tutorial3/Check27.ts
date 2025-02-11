import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Number node is connected to one of the inputs of the Times node.
export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	const numberNode = values.find((node) => node.type === 'number');
	const timesNode = values.find((node) => node.type === 'times');
	const numberNodeId = entries.find((entry) => entry[1] === numberNode)?.[0];

	const numberNodeIsConnectedToTimes =
		timesNode?.inputs?.some((input) => input.id === numberNodeId) ?? false;

	return numberNode && timesNode && numberNodeIsConnectedToTimes;
}
