import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Number and Value nodes where created and connected together.
	const numberNode = values.find((node) => node.type === 'number');
	const numberNodeWasCreated = numberNode !== undefined;
	const valueNode = values.find((node) => node.type === 'value');
	const valueNodeWasCreated = valueNode !== undefined;

	const numberNodeId = entries.find((entry) => entry[1] === numberNode)?.[0];

	const numberNodeWasConnectedToValueNode =
		valueNode?.inputs?.some((input) => input.id === numberNodeId) ?? false;

	return numberNodeWasCreated && valueNodeWasCreated && numberNodeWasConnectedToValueNode;
}
