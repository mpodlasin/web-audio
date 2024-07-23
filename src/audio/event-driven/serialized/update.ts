import { addNode, removeNode, type SerializedAudioElements } from "../../serialized";
import type { AudioCanvasEvent } from "../event";

export type SerializedState = {
    audioGraphHistory: SerializedAudioElements[];
}

export const update = (state: SerializedState, event: AudioCanvasEvent): SerializedState => {
    if (event.type === 'CREATE_NODE') {
        const nodeType = event.payload.nodeType;
        const position = event.payload.position;

        return {
            ...state,
            audioGraphHistory: [
                ...state.audioGraphHistory,
                addNode(state.audioGraphHistory.at(-1) ?? {}, nodeType, position)
            ]
        }
    }

    if (event.type === 'DELETE_NODE') {
        const nodeId = event.payload.nodeId;

        return {
            ...state,
            audioGraphHistory: [
                ...state.audioGraphHistory,
                removeNode(state.audioGraphHistory.at(-1) ?? {}, nodeId)
            ]
        }
    }

    return state;
}