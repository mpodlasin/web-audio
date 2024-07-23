import type { NodeType, Position } from "../serialized";

export type AudioCanvasEvent = {
    type: 'CREATE_NODE',
    payload: {
        nodeType: NodeType;
        position: Position;
    }
};