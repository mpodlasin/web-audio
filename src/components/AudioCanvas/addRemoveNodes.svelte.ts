import type { allowedSerializedAudioElementStaticDefinitions } from '../../audio/serialized';
import type { AudioGraph } from './audioGraph.svelte';
import type DraggingCanvas from './draggingCanvas.svelte';
import type { Menus } from './menus.svelte';
import type PlugPositions from './plugPositions.svelte';

export class AddRemoveNodes {
	constructor(
		private audioGraphStore: AudioGraph,
		private draggingCanvasStore: DraggingCanvas,
		private menusStore: Menus,
		private plugPositionsStore: PlugPositions
	) {}

	handleCreateElementClick = (
		nodeType: keyof typeof allowedSerializedAudioElementStaticDefinitions
	) => {
		this.audioGraphStore.addNode(
			nodeType,
			this.draggingCanvasStore.translatePosition(this.menusStore.menuPosition)
		);
		this.plugPositionsStore.updatePlugPositions();
		this.menusStore.closeMenu();
	};

	handlePasteClick = () => {
		// this.audioGraphStore.insertExistingNodes()
		// updateAudioGraphHistory((audioGraph) =>
		// 	insertExistingNodes(audioGraph, copiedNodes, menuPosition)
		// );
		// closeMenu();
		// updatePlugPositions();
	};

	handleDeleteNode = () => {
		// if (selectedNodeIds.some((selectedId) => selectedId === menuNodeId)) {
		// 	updateAudioGraphHistory((audioGraph) => selectedNodeIds.reduce(removeNode, audioGraph));
		// } else {

		this.audioGraphStore.removeNode(this.menusStore.menuNodeId);
		this.menusStore.closeMenu();
	};
}
