<script lang="ts">
	import type {
		AllowedSerializedAudioElements,
		NodeType,
		Plug,
		Position,
		SerializedAudioElements
	} from '../audio/AudioCanvas';
	import Node from './Node.svelte';
	import { DISTANCE_THAT_IS_CONSIDERED_DRAG } from '../constants';

	interface Props {
		id: string;
		node: AllowedSerializedAudioElements;
		instantiatedNode: unknown;
		color: string;
		position: {
			x: number;
			y: number;
		};
		running: boolean;
		draggingLine: boolean;
		selected: boolean;
		audioGraph: SerializedAudioElements;
		hoveringOverPlug: Plug | null;
		onClick(event: MouseEvent): void;
		onDragStart(): void;
		onDrag(event: { id: string; x: number; y: number }): void;
		onContextMenu(event: { id: string; position: Position; nodeType: NodeType }): void;
		onDragEnd(): void;
		onNodeParameterChangeStart(): void;
		onNodeParamterChange(event: { id: string; parameterName: string; value: number }): void;
		onNodeParameterChangeEnd(): void;
		onNodePlugMouseDown(event: { plugId: string; nodeId: string; type: 'input' | 'output' }): void;
		onNodePlugMouseUp(event: {
			plugId: string;
			nodeId: string;
			type: 'input' | 'output';
			event: MouseEvent;
		}): void;
		onNodeKnobMouseUp(event: { nodeId: string; parameterName: string; event: MouseEvent }): void;
		onKnobCreated(knob: HTMLElement): void;
		onCommentChanged(event: { nodeId: string; comment: string }): void;
		onPlugCreated(plug: HTMLElement): void;
	}

	let {
		id,
		node,
		instantiatedNode,
		color,
		position,
		running,
		draggingLine,
		selected,
		audioGraph,
		hoveringOverPlug,
		onDragStart,
		onDrag,
		onDragEnd,
		onContextMenu,
		onClick,
		onCommentChanged,
		onKnobCreated,
		onNodeKnobMouseUp,
		onNodeParameterChangeEnd,
		onNodeParameterChangeStart,
		onNodeParamterChange,
		onNodePlugMouseDown,
		onNodePlugMouseUp,
		onPlugCreated
	}: Props = $props();

	let internalClickPosition = {
		x: 0,
		y: 0
	};

	let lastDragPosition: Position | null = null;
	let draggedDistance = 0;

	const handlePointerDown = (event: PointerEvent) => {
		event.stopPropagation();
		event.preventDefault();

		if (event.button === 0) {
			const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
			internalClickPosition = {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top
			};

			onDragStart();

			window.addEventListener('pointermove', handlePointerMove);
		}
	};

	const handlePointerMove = (event: PointerEvent) => {
		event.preventDefault();
		event.stopPropagation();

		if (!lastDragPosition) {
			lastDragPosition = {
				x: event.clientX,
				y: event.clientY
			};
		}

		draggedDistance +=
			Math.abs(event.clientX - lastDragPosition.x) + Math.abs(event.clientY - lastDragPosition.y);

		lastDragPosition = {
			x: event.clientX,
			y: event.clientY
		};

		onDrag({
			id,
			x: event.clientX - internalClickPosition.x,
			y: event.clientY - internalClickPosition.y
		});
	};

	const handlePointerUp = (event: PointerEvent) => {
		event.preventDefault();
		event.stopPropagation();

		window.removeEventListener('pointermove', handlePointerMove);

		const notDragged = draggedDistance < DISTANCE_THAT_IS_CONSIDERED_DRAG;

		draggedDistance = 0;
		lastDragPosition = null;

		if (notDragged) {
			onContextMenu({
				id,
				position: { x: event.clientX, y: event.clientY },
				nodeType: node.type
			});
		}

		onDragEnd();
	};
</script>

<div
	onpointerdown={handlePointerDown}
	onpointerup={handlePointerUp}
	oncontextmenu={(e) => e.preventDefault()}
	onclick={onClick}
	onkeydown={() => {}}
	class="wrapper"
	class:selected
	style="position: absolute; left: {position.x}px; top: {position.y}px;"
	role="cell"
	tabindex={0}
>
	<Node
		{id}
		{node}
		{instantiatedNode}
		{running}
		{draggingLine}
		{color}
		{audioGraph}
		{hoveringOverPlug}
		{onCommentChanged}
		{onKnobCreated}
		{onNodeKnobMouseUp}
		{onNodeParameterChangeEnd}
		{onNodeParameterChangeStart}
		{onNodeParamterChange}
		{onNodePlugMouseDown}
		{onNodePlugMouseUp}
		{onPlugCreated}
	/>
</div>

<style>
	.wrapper {
		border-radius: 8px;
	}

	.selected {
		outline: 1px solid var(--neutral-300);
	}
</style>
