<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { AllowedSerializedAudioElements } from '../audio/AudioCanvas';
	import Node from './Node.svelte';

	const disaptcher = createEventDispatcher();

	export let id: string;
	export let node: AllowedSerializedAudioElements;
	export let instantiatedNode: unknown;
	export let position: {
		x: number;
		y: number;
	};
	export let running: boolean;
	export let draggingLine: boolean;

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

			window.addEventListener('mousemove', handleMouseMove);
		}
	};

	const handleMouseMove = (event: MouseEvent) => {
		event.preventDefault();

		disaptcher('drag', {
			id,
			x: event.clientX - internalClickPosition.x,
			y: event.clientY - internalClickPosition.y
		});
	};

	const handleMouseUp = () => {
		window.removeEventListener('mousemove', handleMouseMove);
	};

	const handleContextMenu = (event: MouseEvent) => {
		event.stopPropagation();
	};
</script>

<div
	on:mousedown={handleMouseDown}
	on:mouseup={handleMouseUp}
	on:contextmenu={handleContextMenu}
	on:contextmenu
	style="position: absolute; left: {position.x}px; top: {position.y}px;"
>
	<Node
		{id}
		{node}
		{instantiatedNode}
		{running}
		{draggingLine}
		on:nodePlugAndKnobPositions
		on:nodeParameterChange
		on:nodePlugClick
		on:nodePlugUp
		on:deleteNode
		on:knobMouseUp
	/>
</div>
