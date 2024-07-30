import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Value parameter on Number node was changed from 0;
	const numberNode = values.find((node) => node.type === 'number');

    return numberNode?.parameters?.['value']?.base !== 0;
}
