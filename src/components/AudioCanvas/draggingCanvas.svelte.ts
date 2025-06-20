import type { Position } from '../../audio/serialized';
import type PlugPositions from './plugPositions.svelte';
import type { Resize } from './resize.svelte';

export default class DraggingCanvas {
	public canvasRelativePosition: Position;
	lastDragPosition: Position | null = null;
	draggedDistance = 0;

	constructor(
		canvasRelativePosition: Position,
		private resizeStore: Resize,
		private onCanvasRelativePositionChange: (position: Position) => void,
		private plugPositionsStore: PlugPositions
	) {
		this.canvasRelativePosition = $state(canvasRelativePosition);
	}

	translatePosition = (position: Position) => {
		return {
			x: (position.x - this.canvasRelativePosition.x) / this.resizeStore.size,
			y: (position.y - this.canvasRelativePosition.y) / this.resizeStore.size
		};
	};

	translateEventWithPosition = <E extends Position>(event: E) => {
		const translatedPosition = this.translatePosition(event);

		event.x = translatedPosition.x;
		event.y = translatedPosition.y;
	};

	handleDragCanvasStart = (event: PointerEvent) => {
		if (event.button === 2) return;

		event.preventDefault();

		const position = {
			x: event.clientX,
			y: event.clientY
		};

		this.lastDragPosition = position;

		this.draggedDistance = 0;
	};

	handleDragCanvasEnd = (event: PointerEvent) => {
		event.preventDefault();

		this.onCanvasRelativePositionChange(this.canvasRelativePosition);

		this.lastDragPosition = null;
	};

	handleDragCanvas = (event: PointerEvent) => {
		event.preventDefault();

		if (!this.lastDragPosition) return;

		const position = {
			x: event.clientX,
			y: event.clientY
		};

		const dragDifference = {
			x: position.x - this.lastDragPosition.x,
			y: position.y - this.lastDragPosition.y
		};

		this.draggedDistance += Math.sqrt(dragDifference.x ** 2 + dragDifference.y ** 2);

		this.canvasRelativePosition = {
			x: this.canvasRelativePosition.x + dragDifference.x,
			y: this.canvasRelativePosition.y + dragDifference.y
		};

		this.lastDragPosition = position;

		this.plugPositionsStore.updatePlugPositions();
	};
}
