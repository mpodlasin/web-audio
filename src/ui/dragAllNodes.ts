import type { Position, SerializedAudioElements } from '../audio/serialized';

export const dragAllNodes = (audioElements: SerializedAudioElements, positionChange: Position) => {
	const audioElementsCopy = { ...audioElements };

	for (const id in audioElementsCopy) {
		const node = audioElementsCopy[id];

		if (node && node.ui) {
			node.ui.position.x -= positionChange.x;
			node.ui.position.y -= positionChange.y;
		}
	}

	return audioElementsCopy;
};
