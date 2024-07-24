import { addConnection, addNode, removeConnection, removeNode, type SerializedAudioElements } from '../../serialized';
import type { AudioCanvasEvent } from '../event';

export type SerializedState = {
	audioGraphHistory: SerializedAudioElements[];
};

export const update = (state: SerializedState, event: AudioCanvasEvent): SerializedState => {
	const mapAudioGraph = createMapAudioGraph(state);

	if (event.type === 'CREATE_NODE') {
		const nodeType = event.payload.nodeType;
		const position = event.payload.position;
		const nodeId = event.payload.nodeId;

		return mapAudioGraph((audioGraph) => addNode(audioGraph, nodeType, position, undefined, nodeId));
	}

	if (event.type === 'DELETE_NODE') {
		const nodeId = event.payload.nodeId;

		return mapAudioGraph((audioGraph) => removeNode(audioGraph, nodeId));
	}

	if (event.type === 'ADD_CONNECTION') {
		const fromPlug = event.payload.fromPlug;
		const toPlug = event.payload.toPlug;

		return mapAudioGraph((audioGraph) => addConnection(audioGraph, fromPlug, toPlug));
	}

	if (event.type === 'REMOVE_CONNECTION') {
		const fromPlug = event.payload.fromPlug;
		const toPlug = event.payload.toPlug;

		return mapAudioGraph((audioGraph) => removeConnection(audioGraph, fromPlug, toPlug));
	}

	return state;
};

const createMapAudioGraph =
	(state: SerializedState) =>
	(map: (a: SerializedAudioElements) => SerializedAudioElements): SerializedState => {
		return {
			...state,
			audioGraphHistory: [...state.audioGraphHistory, map(state.audioGraphHistory.at(-1) ?? {})]
		};
	};
