import type { allowedSerializedAudioElementStaticDefinitions, NodeType, Position } from "../../audio/serialized";
import { DISTANCE_THAT_IS_CONSIDERED_DRAG } from "../../constants";
import type { LineToDisplay } from "../../ui/lines";
import type { AudioGraph } from "./audioGraph.svelte";
import type DraggingCanvas from "./draggingCanvas.svelte";
import type { LineDragging } from "./lineDragging.svelte";
import type PlugPositions from "./plugPositions.svelte";

export class Menus {
	menuPosition = $state({ x: 0, y: 0 });
	showMenu = $state(false);
	menuKind: 'canvas' | 'node' | 'line' | 'line-multiply' = $state('canvas');
	chosenLine: LineToDisplay | null = $state(null);
	menuNodeId: string = $state('');
	chosenLineMultiply = $derived(this.chosenLine?.multiply);

    constructor(private draggingCanvasStore: DraggingCanvas, private lineDraggingStore: LineDragging, private audioGraphStore: AudioGraph, private plugPositionsStore: PlugPositions) {}

	handleOpenContextMenu = (event: PointerEvent) => {
		const wasNotDragging = this.draggingCanvasStore.draggedDistance < DISTANCE_THAT_IS_CONSIDERED_DRAG;

		if (this.lineDraggingStore.draggingLine) return;

		if (this.showMenu) {
			this.closeMenu();
			return;
		} else if (wasNotDragging) {
			this.menuPosition = { x: event.clientX, y: event.clientY };
		} else {
			return;
		}

		this.showMenu = true;
		this.menuKind = 'canvas';
		this.chosenLine = null;
		this.chosenLineMultiply = undefined;
	};

	closeMenu = () => {
		this.showMenu = false;
		this.chosenLine = null;
	};

	handleLineClick = (line: LineToDisplay) => (event: MouseEvent) => {
		event.stopPropagation();
		event.preventDefault();
		this.menuPosition = { x: event.clientX, y: event.clientY };
		this.showMenu = true;
	    this.menuKind = 'line';
	    this.chosenLine = line;
	};

	handleNodeClick = (event: { id: string; position: Position; nodeType: NodeType }) => {
		if (event.nodeType === 'tutorial') {
			return;
		}

		if (this.lineDraggingStore.draggingLine) {
			this.lineDraggingStore.stopDragging();
			return;
		}

		this.menuPosition = event.position;
		this.showMenu = true;
		this.menuKind = 'node';
		this.chosenLine = null;
		this.menuNodeId = event.id;
	};

    handleDeleteConnection = (event: MouseEvent) => {
		event.stopPropagation();

		if (!this.chosenLine) return;

        this.audioGraphStore.removeConnection(this.chosenLine.line[0], this.chosenLine.line[1])
    
		this.closeMenu();
	};

	openLineMultiplyMenu = (event: MouseEvent) => {
		event.stopPropagation();

		this.menuKind = 'line-multiply';
	};

    handleMultiplyValueChange = (event: { parameterName: string; value: number }) => {
		const { value } = event;

		if (!this.chosenLine) return;

		const nodeId = this.chosenLine.line[1].nodeId;
		const inputId = this.chosenLine.line[0].nodeId;

        this.audioGraphStore.changeParameterMultiply(nodeId, this.chosenLine.line[1].id, inputId, value)

		this.chosenLineMultiply = value;
	};

	handleMultiplyValueChangeStart = () => {
		this.audioGraphStore.startTemporaryAction();
	};

	handleEndMultiplyValueChange = () => {
		this.audioGraphStore.endTemporaryAction();
	};

	handleCopyNode = () => {
		// if (selectedNodeIds.some((id) => id === menuNodeId)) {
		// 	copiedNodes = selectedNodeIds;
		// } else {
		// 	copiedNodes = [menuNodeId];
		// }
	    this.closeMenu();
	};

    handleCreateElementClick = (
		nodeType: keyof typeof allowedSerializedAudioElementStaticDefinitions
	) => {
        this.audioGraphStore.addNode(nodeType, this.draggingCanvasStore.translatePosition(this.menuPosition));

		this.plugPositionsStore.updatePlugPositions();
		this.closeMenu();
	};

	handlePasteClick = () => {
        this.audioGraphStore.insertExistingNodes([], this.menuPosition)

		this.closeMenu();
		this.plugPositionsStore.updatePlugPositions();
	};

	handleDeleteNode = () => {
		if (selectedNodeIds.some((selectedId) => selectedId === menuNodeId)) {
			updateAudioGraphHistory((audioGraph) => selectedNodeIds.reduce(removeNode, audioGraph));
		} else {
			updateAudioGraphHistory((audioGraph) => removeNode(audioGraph, menuNodeId));
		}
		closeMenu();
	};
}