<script lang="ts">
	import type { SerializedAudioParameter } from '../audio/AudioCanvas';
	import { createEventDispatcher } from 'svelte';

	export let parameterName: string;
	export let parameter: SerializedAudioParameter;
	export let minValue: number;
	export let maxValue: number;
	export let unit: string | null = null;

	$: numberParameter = typeof parameter === 'number' ? parameter : null;
	$: inputParameter = typeof parameter === 'object' ? parameter : null;

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

	$: angle = numberParameter
		? (180 * (numberParameter - minValue)) / (maxValue - minValue) - 90
		: 0;

	function handleMouseMove(event: MouseEvent) {
		event.preventDefault();
		if (isDragging) {
			const { y } = knob.getBoundingClientRect();
			const { clientY } = event;
			const dy = y - clientY;
			const value = previousValue + dy * 10;

			const normalizedValue = Math.min(
				Math.max(value, minValue),
				maxValue
			);

			dispatcher('change', { parameterName, value: normalizedValue });
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
	<div
		class="knob"
		bind:this={knob}
		on:mousedown={handleMouseDown}
		style="transform: rotate({angle}deg)"
	>
		<div class="knob-pointer" />
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
