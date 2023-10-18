import type { SerializedAudioElements } from "../audio/serialized";
import { addDiff, type PlugPositions } from "./plugPositions";

export const dragNode = (drag: { x: number, y: number, id: string }, audioGraphHistory: SerializedAudioElements[], plugPositions: PlugPositions) => {
    const { x, y, id } = drag;
    let audioGraphHistoryCopy = [...audioGraphHistory];
    const audioGraphWithPositions = audioGraphHistoryCopy.at(-1);
    const node = audioGraphWithPositions?.[id];

    if (node) {
        const oldX = node.ui?.position.x ?? 0;
        const oldY = node.ui?.position.y ?? 0;

        const diffX = x - oldX;
        const diffY = y - oldY;

        const prevPositions = plugPositions[id];

        if (!prevPositions) return audioGraphHistory;

        plugPositions[id] = addDiff(prevPositions, diffX, diffY);

        if (audioGraphHistoryCopy.length >= 2) {
            audioGraphHistoryCopy = [
                ...audioGraphHistoryCopy,
                {
                    ...audioGraphHistoryCopy.at(-1),
                    [id]: {
                        ...(audioGraphHistoryCopy.at(-1)?.[id] as any),
                        ui: {
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
                audioGraphHistoryCopy = [
                    onlyElement,
                    {
                        ...onlyElement,
                        [id]: {
                            ...(onlyElement[id] as any),
                            ui: {
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

    return audioGraphHistoryCopy;
}