import type { SerializedAudioElements } from '../audio/serialized';

export const dragNode = (
	drag: { x: number; y: number; id: string },
	audioGraph: SerializedAudioElements
) => {
	const { x, y, id } = drag;
	const node = audioGraph?.[id];

	if (node) {
		return {
			...audioGraph,
			[id]: {
				...node,
				ui: {
					...node.ui,
					position: {
						x,
						y
					}
				}
			}
		};
	}
	return audioGraph;
};
