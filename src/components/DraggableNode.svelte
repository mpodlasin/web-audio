<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type {
		AllowedSerializedAudioElements,
		Position,
		SerializedAudioElements
	} from '../audio/AudioCanvas';
	import Node from './Node.svelte';

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

	let dragStartPosition: Position | null = null;

	const handlePointerDown = (event: PointerEvent) => {
		event.stopPropagation();
		event.preventDefault();

		if (event.button === 0) {
			const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
			internalClickPosition = {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top
			};

			dragStartPosition = {
				x: event.clientX,
				y: event.clientY
			};

			dispatcher('dragstart');

			window.addEventListener('pointermove', handlePointerMove);
		}
	};

	const handlePointerMove = (event: PointerEvent) => {
		event.preventDefault();
		event.stopPropagation();

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

		if (!dragStartPosition) return;

		const xDiff = Math.abs(event.clientX - dragStartPosition.x);
		const yDiff = Math.abs(event.clientY - dragStartPosition.y);

		if (xDiff < 10 && yDiff < 10) {
			dispatcher('contextmenu', { id, position: { x: event.clientX, y: event.clientY } });
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
