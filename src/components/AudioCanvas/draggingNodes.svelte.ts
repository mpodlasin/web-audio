import type { AudioGraph } from './audioGraph.svelte';
import type DraggingCanvas from './draggingCanvas.svelte';
import type PlugPositions from './plugPositions.svelte';

export default class DraggingNodes {
	constructor(
		private audioGraphStore: AudioGraph,
		private plugPositionsStore: PlugPositions,
		private draggingCanvasStore: DraggingCanvas
	) {}

	handleDragStart = () => {
		this.audioGraphStore.startTemporaryAction();
	};

	handleDragNode = (event: { x: number; y: number; id: string }) => {
		this.draggingCanvasStore.translateEventWithPosition(event);

		this.audioGraphStore.dragNode(event);

		// if (selectedNodeIds.some((selectedId) => selectedId === event.id)) {
		// 	const draggedNode = audioGraph[event.id];

		// 	if (!draggedNode) return;

		// 	const diffX = (draggedNode.ui?.position.x ?? 0) - event.x;
		// 	const diffY = (draggedNode.ui?.position.y ?? 0) - event.y;

		// 	updateAudioGraphHistory((audioGraph) =>
		// 		selectedNodeIds.reduce((audioGraph, id) => {
		// 			const node = audioGraph[id];

		// 			if (!node) return audioGraph;

		// 			return dragNode(
		// 				{
		// 					id,
		// 					x: (node.ui?.position.x ?? 0) - diffX,
		// 					y: (node.ui?.position.y ?? 0) - diffY
		// 				},
		// 				audioGraph
		// 			);
		// 		}, audioGraph)
		// 	);
		// }

		this.plugPositionsStore.updatePlugPositions();
	};

	handleNodeDragEnd = () => {
		this.audioGraphStore.endTemporaryAction();
	};
}
