import type { AllowedSerializedAudioElements } from '../../audio/serialized';
import type { AudioGraph } from './audioGraph.svelte';
import type { Menus } from './menus.svelte';

export class ChangeColor {
	changeColorModalIsOpen = $state(false);
	changedColorNodeId = $state('');
	changedColorNode: AllowedSerializedAudioElements | undefined;
	changedNodeColor: string | undefined = $state();

	constructor(
		private audioGraphStore: AudioGraph,
		private menusStore: Menus
	) {
		this.changedColorNode = $derived(this.audioGraphStore.audioGraph[this.changedColorNodeId]);
	}

	openChangeColorModal = (nodeId: string) => () => {
		this.changeColorModalIsOpen = true;
		this.changedColorNodeId = nodeId;
		this.changedNodeColor = this.audioGraphStore.audioGraph[nodeId]?.ui.primaryColor ?? '#000000';
		this.menusStore.closeMenu();
	};

	closeChangeColorModal = () => {
		this.changeColorModalIsOpen = false;
	};

	handleColorChange = (color: string) => {
		this.changedNodeColor = color;
	};

	handleConfirmChange = () => {
		if (!this.changedNodeColor) return;

		// if (selectedNodeIds.some((selectedNodeId) => selectedNodeId === changedColorNodeId)) {
		// 	updateAudioGraphHistory((audioGraph) =>
		// 		selectedNodeIds.reduce(
		// 			(audioGraph, nodeId) =>
		// 				changeNodeColor(nodeId, changedNodeColor ?? '#000000', audioGraph),
		// 			audioGraph
		// 		)
		// 	);
		// } else {

		this.audioGraphStore.changeNodeColor(this.changedColorNodeId, this.changedNodeColor);
		// }

		this.closeChangeColorModal();
	};
}
