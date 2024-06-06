<script lang="ts">
	import type { Position, SerializedAudioParameter } from '../audio/AudioCanvas';
	import { createEventDispatcher } from 'svelte';
	import { rewriteStringWithNumber } from '../utils/rewriteStringWithNumber';

	type Polarity = 'uni' | 'bi';

	export let nodeId: string;
	export let parameterName: string;
	export let parameter: SerializedAudioParameter;
	export let audioParamAnalyser: AnalyserNode | undefined;
	export let defaultValue: number;
	export let minValue: number;
	export let maxValue: number;
	export let unit: string | null = null;
	export let polarity: Polarity;
	export let draggingLine: boolean;
	export let linear: boolean = false;

	let knob: HTMLDivElement;

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

	$: {
		dispatcher('knobCreated', knob);
	}

	let isDragging = false;
	let draggingStartPosition: Position | null = null;

	function handleMouseDown(event: PointerEvent) {
		event.stopPropagation();
		event.preventDefault();

		isDragging = true;
		draggingStartPosition = {
			x: event.clientX,
			y: event.clientY
		};
		previousAngle = angle;

		dispatcher('mousedown');

		window.addEventListener('pointermove', handleMouseMove);
		window.addEventListener(
			'pointerup',
			() => {
				isDragging = false;
				draggingStartPosition = null;
				window.removeEventListener('pointermove', handleMouseMove);
			},
			{ once: true }
		);
	}

	function handleMouseUp(event: PointerEvent) {
		dispatcher('mouseup', {
			parameterName,
			event
		});
	}

	const normalizeNumberParameter = (numberParameter: number, polarity: Polarity) =>
		polarity === 'uni'
			? numberParameter / (maxValue - minValue)
			: (numberParameter / (maxValue - minValue)) * 2;

	const denormalizeNumberParameter = (normalizedNumberParameter: number, polarity: Polarity) =>
		polarity === 'uni'
			? normalizedNumberParameter * (maxValue - minValue)
			: (normalizedNumberParameter * (maxValue - minValue)) / 2;

	$: normalizedNumberParameter = normalizeNumberParameter(numberParameter, polarity);

	const mapNumberParameter = (numberParameter: number, linear: boolean) =>
		linear ? numberParameter : Math.cbrt(numberParameter);

	const demapNumberParameter = (mappedNumberParameter: number, linear: boolean) =>
		linear ? mappedNumberParameter : Math.pow(mappedNumberParameter, 3);

	$: mappedNumberParameter = mapNumberParameter(normalizedNumberParameter, linear);

	const angleSpread = 270;

	const mapToAngle = (numberParameter: number, polarity: Polarity) =>
		polarity === 'uni'
			? angleSpread * numberParameter - angleSpread / 2
			: (angleSpread / 2) * numberParameter;

	const demapFromAngle = (angle: number, polarity: Polarity) =>
		polarity === 'uni' ? (angle + angleSpread / 2) / angleSpread : angle / (angleSpread / 2);

	$: angle = mapToAngle(mappedNumberParameter, polarity);

	let previousAngle = angle ?? 0;

	function handleMouseMove(event: PointerEvent) {
		event.preventDefault();
		event.stopPropagation();

		if (isDragging && draggingStartPosition) {
			const factor = event.shiftKey ? 10 : 3;
			const { y } = draggingStartPosition;
			const { clientY } = event;
			const dy = y - clientY;
			const normalizedValueChange = dy / factor;

			const newAngle = previousAngle + normalizedValueChange;

			const newValue = denormalizeNumberParameter(
				demapNumberParameter(demapFromAngle(newAngle, polarity), linear),
				polarity
			);

			dispatcher('change', {
				parameterName,
				value: Math.max(minValue, Math.min(maxValue, newValue))
			});
		}
	}

	let animating = false;

	$: {
		if (isControlled && !animating && audioParamAnalyser) {
			animating = true;
			animateAudioParam();
		} else if (!isControlled && animating) {
			animating = false;
		}
	}

	const bufferLength = audioParamAnalyser?.frequencyBinCount;
	const dataArray = new Float32Array(bufferLength ?? 0);

	let animatedValue = 0;

	function animateAudioParam() {
		if (audioParamAnalyser && isControlled && animating) {
			audioParamAnalyser.getFloatTimeDomainData(dataArray);

			animatedValue = dataArray[0] ?? 0;

			requestAnimationFrame(animateAudioParam);
		}
	}

	$: sum = animatedValue + numberParameter;
	$: normalizedSum = normalizeNumberParameter(sum, polarity);
	$: mappedSum = mapNumberParameter(normalizedSum, linear);
	$: clippedSum = Math.max(minValue, Math.min(maxValue, mappedSum));

	let highlightStyle = '';

	$: {
		if (polarity === 'uni') {
			highlightStyle = `background: radial-gradient(closest-side, var(--neutral-900) 90%, transparent 80% 100%), conic-gradient(from ${
				-angleSpread / 2
			}deg, var(--primary-500) ${clippedSum * (angleSpread / 360) * 100}%, var(--neutral-900) 0);`;
		} else if (polarity === 'bi' && clippedSum >= 0) {
			highlightStyle = `background: radial-gradient(closest-side, var(--neutral-900) 90%, transparent 80% 100%), conic-gradient(from 0deg, var(--primary-500) ${
				clippedSum * (angleSpread / 2 / 360) * 100
			}%, var(--neutral-900) 0);`;
		} else if (polarity === 'bi' && clippedSum < 0) {
			highlightStyle = `background: radial-gradient(closest-side, var(--neutral-900) 90%, transparent 80% 100%), conic-gradient(from ${
				clippedSum * (angleSpread / 2)
			}deg, var(--primary-500) ${
				-clippedSum * (angleSpread / 2 / 360) * 100
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

<div
	class="wrapper"
	data-knob
	data-node-id={nodeId}
	data-parameter-name={parameterName}
	bind:this={knob}
>
	<div class="title">{rewriteStringWithNumber(parameterName)}</div>
	<div class="knob-wrapper" style={highlightStyle}>
		<div
			class="knob"
			on:pointerdown={handleMouseDown}
			on:pointerup={handleMouseUp}
			on:mouseenter={handleMouseEnter}
			on:mouseleave={handleMouseLeave}
			on:click={handleClick}
			on:keypress={() => {}}
			style="transform: rotate({angle}deg)"
		>
			<div class="knob-pointer" />
			<div class:visible={isControlled} class="controlled-knob-circle" />
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
