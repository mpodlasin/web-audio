<script lang="ts">
	import type { SerializedAudioParameter } from '../audio/AudioCanvas';
	import { createEventDispatcher } from 'svelte';

	export let parameterName: string;
	export let parameter: SerializedAudioParameter;
	export let minValue: number;
	export let maxValue: number;

	const numberParameter = typeof parameter === 'number' ? parameter : null;
	const inputParameter = typeof parameter === 'object' ? parameter : null;

	const dispatcher = createEventDispatcher();

	let knob: HTMLDivElement;

	let isDragging = false;

	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		window.addEventListener('mousemove', handleMouseMove);
	}

	$: angle = numberParameter ? 180 * (numberParameter - minValue) / (maxValue - minValue) - 90 : 0;

	function handleMouseMove(event: MouseEvent) {
		if (isDragging) {
			const { x, y } = knob.getBoundingClientRect();
			const { clientX, clientY } = event;
			const dx = clientX - x;
			const dy = clientY - y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const maxDistance = 40;
			const value = Math.min(distance / maxDistance, 1);
			dispatcher('change', { parameterName, value });
		}
	}

	$: {
		if (knob) {
			dispatcher('knob', {
				parameterName,
				x: knob.getBoundingClientRect().x,
				y: knob.getBoundingClientRect().y
			});
		}
	}
</script>

<div class="wrapper">
	<div>{parameterName}</div>
	<div class="knob" bind:this={knob} on:mousedown={handleMouseDown} style="transform: rotate({angle}deg)">
		<div class="knob-pointer"></div>
	</div>
	{#if numberParameter !== null}
		<div>{numberParameter}</div>
	{/if}
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
	}
	.knob {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: gray;
		border: 2px solid lightgray;
		position: relative;
	}

	.knob-pointer {
		width: 2px;
		height: 16px;
		background-color: lightgray;
		position: absolute;
		top: 0;
		left: 50%;
		transform-origin: bottom;
		transform: translateX(-50%);
	}
</style>
