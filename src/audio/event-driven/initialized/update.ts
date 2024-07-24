import { isCustomAudioScheduledSourceNode, type AudioNodeDatabase } from "../../initialized";
import type { AudioCanvasEvent } from "../event";
import { createCustomAudioNode } from "./utils";

export const update = (audioNodeDatabase: AudioNodeDatabase, event: AudioCanvasEvent): AudioNodeDatabase => {
    if (event.type === 'CREATE_NODE') {
        const nodeType = event.payload.nodeType;
        const nodeId = event.payload.nodeId;

        const node = createCustomAudioNode(nodeId, nodeType);

        if (isCustomAudioScheduledSourceNode(node)) {
            node.start();
        }

        audioNodeDatabase[nodeId] = createCustomAudioNode(nodeId, nodeType);
    }

    return audioNodeDatabase;
}