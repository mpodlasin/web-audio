import type { AudioGraph } from './audioGraph.svelte';
import type PlugPositions from './plugPositions.svelte';

export class LineDragging {
	draggingLine = $state(false);
	startingPlug: { id: string; type: 'input' | 'output'; nodeId: string } | null = null;
	positionOfStartingPlug: { x: number; y: number } = $state({ x: 0, y: 0 });
	positionOfEndPlug: { x: number; y: number } | null = $state(null);

	constructor(
		private plugPositionsStore: PlugPositions,
		private audioGraphStore: AudioGraph
	) {}

	handlePlugDown = (event: { plugId: string; type: 'input' | 'output'; nodeId: string }) => {
		const { plugId, type, nodeId } = event;

		this.draggingLine = true;
		this.startingPlug = { id: plugId, type, nodeId };
		const rawPositionOfStartingPlug =
			this.plugPositionsStore.plugPositions[nodeId]?.[
				type === 'input' ? 'inputPlugPositions' : 'outputPlugPositions'
			][plugId];

		if (!rawPositionOfStartingPlug) throw new Error('rawPositionOfStartingPlug is undefined!!!');

		this.positionOfStartingPlug = {
			x: rawPositionOfStartingPlug.x,
			y: rawPositionOfStartingPlug.y
		};

		window.addEventListener('pointerup', this.stopDragging, { once: true });
	};

	stopDragging = () => {
		this.draggingLine = false;
		this.startingPlug = null;
		this.positionOfStartingPlug = { x: 0, y: 0 };
		this.positionOfEndPlug = null;
	};

	handleLineDrag = (event: PointerEvent) => {
		if (!this.draggingLine) return;

		event.preventDefault();
		const position = { x: event.clientX, y: event.clientY };

		this.positionOfEndPlug = {
			x: position.x,
			y: position.y
		};
	};

	handlePlugUp = (event: {
		plugId: string;
		type: 'input' | 'output';
		nodeId: string;
		event: PointerEvent;
	}) => {
		const connectedToPlug = this.handleLineDragStopForPlug(event.event);

		if (connectedToPlug) return;

		const connectedToKnob = this.handleLineDragStopForKnob(event.event);

		if (connectedToKnob) return;

		this.stopDragging();
	};

	handleKnobMouseUp = (event: { nodeId: string; parameterName: string; event: PointerEvent }) => {
		if (!this.draggingLine) return;
		if (!this.startingPlug) return;

		this.audioGraphStore.addConnectionToParameter(this.startingPlug, {
			nodeId: event.nodeId,
			type: 'input',
			id: event.parameterName
		});

		this.stopDragging();
	};

	handleLineDragStopForKnob = (event: PointerEvent) => {
		if (!this.draggingLine) return false;
		if (!this.startingPlug) return false;

		const element = document.elementFromPoint(event.clientX, event.clientY);

		if (!element) return false;

		const knob = element.closest('[data-parameter-name]');

		if (!knob) return false;

		const parameterName = knob.getAttribute('data-parameter-name');

		if (!parameterName) return false;

		const nodeId = knob.getAttribute('data-node-id');

		if (!nodeId) return false;

		this.audioGraphStore.addConnectionToParameter(this.startingPlug, {
			nodeId,
			type: 'input',
			id: parameterName
		});

		this.stopDragging();

		return true;
	};

	handleLineDragStopForPlug = (event: PointerEvent) => {
		if (!this.draggingLine) return false;
		if (!this.startingPlug) return false;

		const element = document.elementFromPoint(event.clientX, event.clientY);

		if (!element) return false;

		const plug = element.closest('[data-id]');

		if (!plug) return false;

		const id = plug.getAttribute('data-id');

		if (!id) return false;

		const nodeId = plug.getAttribute('data-node-id');

		if (!nodeId) return false;

		const type = plug.getAttribute('data-type') as 'input' | 'output' | null;

		if (!type) return false;

		try {
			this.audioGraphStore.addConnection(this.startingPlug, { id, type, nodeId });
		} catch {
			return false;
		}

		this.stopDragging();

		return true;
	};
}
