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

	const handlePointerDown = (event: PointerEvent) => {
		event.stopPropagation();

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

		dispatcher('drag', {
			id,
			x: event.clientX - internalClickPosition.x,
			y: event.clientY - internalClickPosition.y
		});
	};

	const handlePointerUp = () => {
		window.removeEventListener('pointermove', handlePointerMove);
	};

	// const handleNodeClick = (event: PointerEvent) => {
	// 	event.stopPropagation();

	// 	let position: Position | null = null;

	// 	if (!touchStartPosition) {
	// 		return;
	// 	}

	// 	const xDiff = Math.abs(event.clientX - touchStartPosition.x);
	// 	const yDiff = Math.abs(event.clientY - touchStartPosition.y);

	// 	if (xDiff < 10 && yDiff < 10) {
	// 		position = {
	// 			x: event.clientX,
	// 			y: event.clientY
	// 		};
	// 	}

	// 	if (position) {
	// 		dispatcher('contextmenu', { id, position });
	// 	}
	// };
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
		on:nodePlugClick
		on:nodePlugTouchStart
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
