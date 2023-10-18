<script lang="ts">
	import type { SerializedAudioParameter } from '../audio/AudioCanvas';
	import { createEventDispatcher } from 'svelte';

	export let parameterName: string;
	export let parameter: SerializedAudioParameter;
	export let audioParamAnalyser: AnalyserNode | undefined;
	export let defaultValue: number;
	export let minValue: number;
	export let maxValue: number;
	export let unit: string | null = null;
	export let polarity: 'uni' | 'bi';
	export let draggingLine: boolean;

	let hoveringOver = false;

	$: hoveringOverWhileDraggingLine = hoveringOver && draggingLine;

	$: numberParameter = parameter.base;
	$: isControlled = parameter.inputs.length > 0 || hoveringOverWhileDraggingLine;

	const handleMouseEnter = () => {
		hoveringOver = true;
	};

	const handleMouseLeave = () => {
		hoveringOver = false;
	};

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
			const factor = event.shiftKey ? 5000 : 500;
			const { y } = knob.getBoundingClientRect();
			const { clientY } = event;
			const dy = y - clientY;
			const value = previousValue + (dy * (maxValue - minValue)) / factor;

			const normalizedValue = Math.min(Math.max(value, minValue), maxValue);

			dispatcher('change', { parameterName, value: normalizedValue });
		}
	}

	$: {
		if (knob) {
			dispatcher('knob', {
				parameterName,
				x: knob.getBoundingClientRect().x + 6,
				y: knob.getBoundingClientRect().y + 6
			});
		}
	}

	$: {
		if (audioParamAnalyser && isControlled) {
			animateAudioParam();
		}
	}

	const bufferLength = audioParamAnalyser?.frequencyBinCount;
	const dataArray = new Float32Array(bufferLength ?? 0);

	let animatedValue = 0;

	function animateAudioParam() {
		if (audioParamAnalyser && isControlled) {
			audioParamAnalyser.getFloatTimeDomainData(dataArray);

			animatedValue = dataArray[0] ?? 0;

			requestAnimationFrame(animateAudioParam);
		}
	}

	$: animatedValueWithBase = animatedValue + numberParameter;

	$: highlightAngle = (180 * (animatedValueWithBase - minValue)) / (maxValue - minValue) - 90;

	let highlightStyle = '';

	$: {
		if (polarity === 'uni') {
			highlightStyle = `background: radial-gradient(closest-side, var(--neutral-900) 90%, transparent 80% 100%), conic-gradient(from -90deg, var(--primary-500) ${
				((highlightAngle + 90) / 180) * 50
			}%, var(--neutral-900) 0);`;
		} else if (polarity === 'bi' && animatedValueWithBase >= 0) {
			highlightStyle = `background: radial-gradient(closest-side, var(--neutral-900) 90%, transparent 80% 100%), conic-gradient(from 0deg, var(--primary-500) ${
				((highlightAngle + 90) / 180) * 50 - 25
			}%, var(--neutral-900) 0);`;
		} else if (polarity === 'bi' && animatedValueWithBase < 0) {
			highlightStyle = `background: radial-gradient(closest-side, var(--neutral-900) 90%, transparent 80% 100%), conic-gradient(from ${highlightAngle}deg, var(--primary-500) ${
				25 - ((highlightAngle + 90) / 180) * 50
			}%, var(--neutral-900) 0);`;
		}
	}

	const handleClick = (event: MouseEvent) => {
		if (event.detail === 2) {
			dispatcher('change', { parameterName, value: defaultValue });
		}
	};

	let numberParameterInput = false;
	let editedNumber = numberParameter;

	const handleParameterValueClick = (event: MouseEvent) => {
		if (event.detail === 2) {
			numberParameterInput = true;
			editedNumber = Number(numberParameter.toFixed(2));

			setTimeout(() => {
				window.addEventListener('click', closeInput);
			});
		}
	};

	const closeInput = () => {
		numberParameterInput = false;

		window.removeEventListener('click', closeInput);
	};

	const handleInputEnter = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			numberParameterInput = false;
			dispatcher('change', {
				parameterName,
				value: editedNumber
			});
		}
	};
</script>

<div class="wrapper">
	<div class="title">{parameterName}</div>
	<div class="knob-wrapper" style={highlightStyle}>
		<div
			class="knob"
			on:mousedown={handleMouseDown}
			on:mouseup={handleMouseUp}
			on:mouseenter={handleMouseEnter}
			on:mouseleave={handleMouseLeave}
			on:click={handleClick}
			on:keypress={() => {}}
			style="transform: rotate({angle}deg)"
		>
			<div class="knob-pointer" />
			<div class:visible={isControlled} class="controlled-knob-circle" bind:this={knob} />
		</div>
	</div>
	{#if numberParameterInput}
		<!-- svelte-ignore a11y-autofocus -->
		<input autofocus type="number" bind:value={editedNumber} on:keydown={handleInputEnter} />
	{:else if numberParameter !== null}
		<div class="value" on:click={handleParameterValueClick} on:keypress={() => {}}>
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
		width: 35px;
		height: 35px;
		border-radius: 50%;
		background-color: var(--neutral-500);
		border: 2px solid var(--neutral-300);
		position: relative;
	}

	.knob-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}

	.knob-pointer {
		width: 2px;
		height: 15px;
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
		background-color: var(--neutral-700);
		border: 2px solid var(--neutral-300);
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		opacity: 0;
		transition: opacity 0.2s;
	}

	.visible {
		opacity: 1;
	}

	.title {
		font-size: 12px;
	}

	.value {
		font-size: 10px;
		border: 2px solid transparent;
	}

	input {
		background-color: var(--neutral-700);
		border: 1px solid var(--neutral-300);
		color: var(--neutral-300);
		max-width: 50px;
		outline: none;
		font-size: 10px;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type='number'] {
		appearance: textfield;
		-moz-appearance: textfield;
	}
</style>
