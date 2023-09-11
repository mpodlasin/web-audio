<script lang="ts">
	import type { SerializedAudioParameter } from '../audio/AudioCanvas';
	import { createEventDispatcher } from 'svelte';

	export let parameterName: string;
	export let parameter: SerializedAudioParameter;
	export let minValue: number;
	export let maxValue: number;
	export let unit: string | null = null;

	$: numberParameter = parameter.base;
	$: isControlled = parameter.inputs.length > 0;

	const dispatcher = createEventDispatcher();

	let knob: HTMLDivElement;

	let isDragging = false;
	let previousValue = numberParameter ?? 0;

	function handleMouseDown(event: MouseEvent) {
		event.stopPropagation();
		isDragging = true;
		window.addEventListener('mousemove', handleMouseMove);

		window.addEventListener('mouseup', () => {
			isDragging = false;
			previousValue = numberParameter ?? 0;
			window.removeEventListener('mousemove', handleMouseMove);
		});
	}

	function handleMouseUp() {
		dispatcher('mouseup', {
			parameterName
		});
	}

	$: angle = (180 * (numberParameter - minValue)) / (maxValue - minValue) - 90;

	function handleMouseMove(event: MouseEvent) {
		event.preventDefault();
		if (isDragging) {
			const { y } = knob.getBoundingClientRect();
			const { clientY } = event;
			const dy = y - clientY;
			const value = previousValue + (dy * (maxValue - minValue)) / 500;

			const normalizedValue = Math.min(Math.max(value, minValue), maxValue);

			dispatcher('change', { parameterName, value: normalizedValue });
		}
	}

	$: {
		if (knob) {
			dispatcher('knob', {
				parameterName,
				x: knob.getBoundingClientRect().x - 2,
				y: knob.getBoundingClientRect().y - 2,
			});
		}
	}
</script>

<div class="wrapper">
	<div>{parameterName}</div>
	<div
		class="knob"
		on:mousedown={handleMouseDown}
		on:mouseup={handleMouseUp}
		style="transform: rotate({angle}deg)"
	>
		<div class="knob-pointer" />
		<div class:visible={isControlled} class="controlled-knob-circle" bind:this={knob} />
	</div>
	{#if numberParameter !== null}
		<div>
			{numberParameter.toFixed(2)}
			{#if unit}
				{' '}{unit}
			{/if}
		</div>
	{/if}
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		min-width: 80px;
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

	.controlled-knob-circle {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: gray;
		border: 2px solid lightgray;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		visibility: hidden;
	}

	.visible {
		visibility: visible;
	}
</style>
