<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type {
		AllowedSerializedAudioElements,
		Position,
		SerializedAudioElements
	} from '../audio/AudioCanvas';
	import Node from './Node.svelte';
	import { DISTANCE_THAT_IS_CONSIDERED_DRAG } from '../constants';

	const dispatcher = createEventDispatcher();

	export let id: string;
	export let node: AllowedSerializedAudioElements;
	export let instantiatedNode: unknown;
	export let color: string | undefined;
	export let position: {
		x: number;
		y: number;
	};
	export let running: boolean;
	export let draggingLine: boolean;
	export let selected: boolean;
	export let audioGraph: SerializedAudioElements;

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

			dispatcher('dragstart');

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

		dispatcher('drag', {
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
			dispatcher('contextmenu', { id, position: { x: event.clientX, y: event.clientY }, nodeType: node.type });
		} else {
			dispatcher('dragend');
		}
	};
</script>

<div
	on:pointerdown={handlePointerDown}
	on:pointerup={handlePointerUp}
	on:click
	on:keydown={() => {}}
	class="wrapper"
	class:selected
	style="position: absolute; left: {position.x}px; top: {position.y}px;"
>
	<Node
		{id}
		{node}
		{instantiatedNode}
		{running}
		{draggingLine}
		{color}
		{audioGraph}
		on:nodeParameterChangeStart
		on:nodeParameterChange
		on:nodePlugTouchStart
		on:nodePlugDown
		on:nodePlugUp
		on:deleteNode
		on:knobMouseUp
		on:plugCreated
		on:knobCreated
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
