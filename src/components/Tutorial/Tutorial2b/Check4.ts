import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Oscilloscope node was created and Number node was connected to it.
	
	const oscilloscopeNode = values.find(node => node.type === 'oscilloscope');
	const numberNode = values.find(node => node.type === 'number');
	const numberNodeId = entries.find(entry => entry[1] === numberNode)?.[0];

	return oscilloscopeNode?.inputs?.some(input => input.id === numberNodeId) ?? false;
}
