import type { NodeType, Plug, Position } from '../serialized';

export type AudioCanvasEvent =
	| {
			type: 'CREATE_NODE';
			payload: {
				nodeType: NodeType;
				position: Position;
			};
	  }
	| {
			type: 'DELETE_NODE';
			payload: {
				nodeId: string;
			};
	  }
	| {
			type: 'ADD_CONNECTION';
			payload: {
				fromPlug: Plug;
				toPlug: Plug;
			};
	  }
    | {
		type: 'REMOVE_CONNECTION';
		payload: {
			fromPlug: Plug;
			toPlug: Plug;
		}
	};
