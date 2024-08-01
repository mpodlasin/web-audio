import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	//  node was created.
	const clockNode = values.find((node) => node.type === 'clock');

	return clockNode !== undefined;
}
