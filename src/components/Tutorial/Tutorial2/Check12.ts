import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

	// Number node is connected to Value and Mult is also still connected.
    const numberNode = values.find((node) => node.type === 'number');
    const valueNode = values.find((node) => node.type === 'value');
    const multNode = values.find((node) => node.type === 'multiply');

    const numberNodeId = entries.find(entry => entry[1] === numberNode)?.[0];
    const multNodeId = entries.find(entry => entry[1] === multNode)?.[0];

    const numberNodeWasConnectedtoValue = valueNode?.inputs?.some(input => input.id === numberNodeId) ?? false;
    const multNodeIsStillConnectedtoValue = valueNode?.inputs?.some(input => input.id === multNodeId) ?? false;

    return numberNodeWasConnectedtoValue && multNodeIsStillConnectedtoValue;
}
