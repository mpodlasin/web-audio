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

	const handleMouseDown = (event: MouseEvent) => {
		event.stopPropagation();

		if (event.button === 0) {
			const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
			internalClickPosition = {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top
			};

			dispatcher('dragstart');

			window.addEventListener('mousemove', handleMouseMove);
		}
	};

	const handleTouchStart = (event: TouchEvent) => {
		event.stopPropagation();

		const touch = event.touches[0];

		if (!touch) {
			return;
		}

		const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
		internalClickPosition = {
			x: touch.clientX - rect.left,
			y: touch.clientY - rect.top
		};

		dispatcher('dragstart');

		window.addEventListener('touchmove', handleTouchMove);
	};

	const handleTouchMove = (event: TouchEvent) => {
		const touch = event.touches[0];

		if (!touch) {
			return;
		}

		dispatcher('drag', {
			id,
			x: touch.clientX - internalClickPosition.x,
			y: touch.clientY - internalClickPosition.y
		});
	};

	const handleTouchEnd = () => {
		window.removeEventListener('touchmove', handleTouchMove);
	};

	const handleMouseMove = (event: MouseEvent) => {
		event.preventDefault();

		dispatcher('drag', {
			id,
			x: event.clientX - internalClickPosition.x,
			y: event.clientY - internalClickPosition.y
		});
	};

	const handleMouseUp = () => {
		window.removeEventListener('mousemove', handleMouseMove);
	};

	let touchStartPosition: Position | null = null;

	const registerTouchStartPosition = (event: TouchEvent) => {
		const touch = event.touches[0];

		if (!touch) {
			return;
		}
		touchStartPosition = {
			x: touch.clientX,
			y: touch.clientY
		};
	};

	const handleNodeClick = (event: MouseEvent | TouchEvent) => {
		event.stopPropagation();

		let position: Position | null = null;
		if (event instanceof TouchEvent) {
			const touch = event.changedTouches[0];

			if (!touchStartPosition) {
				return;
			}

			if (!touch) {
				return;
			}

			const xDiff = Math.abs(touch.clientX - touchStartPosition.x);
			const yDiff = Math.abs(touch.clientY - touchStartPosition.y);

			if (xDiff < 10 && yDiff < 10) {
				position = {
					x: touch.clientX,
					y: touch.clientY
				};
			}
		} else {
			event.preventDefault();
			position = {
				x: event.clientX,
				y: event.clientY
			};
		}

		if (position) {
			dispatcher('contextmenu', { id, position });
		}
	};
</script>

<div
	on:mousedown={handleMouseDown}
	on:mouseup={handleMouseUp}
	on:contextmenu={handleNodeClick}
	on:click
	on:touchstart={handleTouchStart}
	on:touchend={handleTouchEnd}
	on:touchstart={registerTouchStartPosition}
	on:touchend={handleNodeClick}
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
