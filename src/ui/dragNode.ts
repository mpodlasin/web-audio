import type { SerializedAudioElements } from '../audio/serialized';

export const dragNode = (
	drag: { x: number; y: number; id: string },
	audioGraphHistory: SerializedAudioElements[]
) => {
	const { x, y, id } = drag;
	let audioGraphHistoryCopy = [...audioGraphHistory];
	const audioGraphWithPositions = audioGraphHistoryCopy.at(-1);
	const node = audioGraphWithPositions?.[id];

	if (node) {
		if (audioGraphHistoryCopy.length >= 2) {
			audioGraphHistoryCopy = [
				...audioGraphHistoryCopy.slice(0, -1),
				{
					...audioGraphWithPositions,
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
				}
			];
		} else {
			const onlyElement = audioGraphHistoryCopy[0];

			if (onlyElement) {
				const node = onlyElement[id];

				if (node) {
					audioGraphHistoryCopy = [
						onlyElement,
						{
							...onlyElement,
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
						}
					];
				}
			}
		}
	}

	return audioGraphHistoryCopy;
};
