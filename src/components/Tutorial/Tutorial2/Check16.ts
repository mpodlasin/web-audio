import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Clock was connected to Value node.
    const valueNode = values.find((node) => node.type === 'value');
	const clockNode = values.find((node) => node.type === 'clock');

	const clockNodeId = entries.find(entry => entry[1] === clockNode)?.[0];

	return valueNode?.inputs?.some(input => input.id === clockNodeId) ?? false;
}
