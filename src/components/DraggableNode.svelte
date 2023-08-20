<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { AllowedSerializedAudioElements } from '../audio/AudioCanvas';
	import Node from './Node.svelte';

	const disaptcher = createEventDispatcher();

	export let id: string;
	export let node: AllowedSerializedAudioElements;
	export let position: {
		x: number;
		y: number;
	};

	let isDragging = false;
	let internalClickPosition = {
		x: 0,
		y: 0
	};

	const handleMouseDown = (event: MouseEvent) => {
		isDragging = true;
		const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
		internalClickPosition = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (!isDragging) return;
		event.preventDefault();

		disaptcher('drag', {
			id,
			x: event.clientX - internalClickPosition.x,
			y: event.clientY - internalClickPosition.y
		});
	};

	const handleMouseUp = (event: MouseEvent) => {
		isDragging = false;
	};
</script>

<div
	on:mousemove={handleMouseMove}
	on:mousedown={handleMouseDown}
	on:mouseup={handleMouseUp}
	style="position: absolute; left: {position.x}px; top: {position.y}px;"
>
	<Node {id} {node} on:nodePlugAndKnobPositions on:nodeParameterChange />
</div>
