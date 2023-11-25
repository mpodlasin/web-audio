import type { SerializedAudioElements } from '../audio/serialized';

export const changeNodeColor = (
	nodeId: string,
	color: string,
	audioGraph: SerializedAudioElements
): SerializedAudioElements => {
	const node = audioGraph[nodeId];

	if (!node) return audioGraph;

	return {
		...audioGraph,
		[nodeId]: {
			...node,
			ui: {
				...node.ui,
				primmaryColor: color
			} as any
		}
	};
};
