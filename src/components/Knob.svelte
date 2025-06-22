<script lang="ts">
	import type { Position, SerializedAudioParameter } from '../audio/AudioCanvas';
	import { rewriteStringWithNumber } from '../utils/rewriteStringWithNumber';

	type Polarity = 'uni' | 'bi';

	interface Props {
		nodeId: string;
		nodeOrder: number;
		parameterName: string;
		parameter: SerializedAudioParameter;
		audioParamAnalyser: AnalyserNode | undefined;
		defaultValue: number;
		minValue: number;
		maxValue: number;
		unit?: string | null;
		polarity: Polarity;
		draggingLine: boolean;
		linear?: boolean;
		discrete?: boolean;
		onMouseDown(): void;
		onMouseUp(event: { parameterName: string; event: MouseEvent }): void;
		onChange(event: { parameterName: string; value: number }): void;
		onKnobCreated?(knob: HTMLElement): void;
	}

	let {
		nodeId,
		parameterName,
		parameter,
		audioParamAnalyser,
		defaultValue,
		minValue,
		maxValue,
		unit = null,
		polarity,
		draggingLine,
		linear = false,
		discrete = false,
		nodeOrder,
		onMouseDown,
		onMouseUp,
		onChange,
		onKnobCreated
	}: Props = $props();

	let knobWrapper: HTMLDivElement | undefined = $state();

	let numberParameter = $derived(parameter.base);

	let hoveringOver = $state(false);

	const handleMouseEnter = () => {
		hoveringOver = true;
	};

	const handleMouseLeave = () => {
		hoveringOver = false;
	};

	let isDragging = false;
	let draggingStartPosition: Position | null = null;

	function handlePointerDown(event: PointerEvent) {
		if (event.button === 2) return;

		event.stopPropagation();
		event.preventDefault();

		isDragging = true;
		draggingStartPosition = {
			x: event.clientX,
			y: event.clientY
		};
		previousAngle = angle;

		onMouseDown();

		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerUp, { once: true, capture: true });
	}

	function handlePointerUp(event: PointerEvent) {
		event.preventDefault();
		event.stopPropagation();

		if (isDragging) {
			isDragging = false;
			draggingStartPosition = null;
			window.removeEventListener('pointermove', handlePointerMove);
		}

		onMouseUp({
			parameterName,
			event
		});
	}

	const angleSpread = 270;

	const normalizeNumberParameter = (numberParameter: number, polarity: Polarity) =>
		polarity === 'uni'
			? (numberParameter - minValue) / (maxValue - minValue)
			: numberParameter / maxValue;
	const denormalizeNumberParameter = (normalizedNumberParameter: number, polarity: Polarity) =>
		polarity === 'uni'
			? normalizedNumberParameter * (maxValue - minValue) + minValue
			: normalizedNumberParameter * maxValue;

	const mapNumberParameter = (numberParameter: number, linear: boolean) =>
		linear ? numberParameter : Math.cbrt(numberParameter);
	const demapNumberParameter = (mappedNumberParameter: number, linear: boolean) =>
		linear ? mappedNumberParameter : Math.pow(mappedNumberParameter, 3);

	const mapToAngle = (numberParameter: number, polarity: Polarity) =>
		polarity === 'uni' ? angleSpread * numberParameter : (angleSpread * numberParameter) / 2;
	const demapFromAngle = (angle: number, polarity: Polarity) =>
		polarity === 'uni' ? angle / angleSpread : (angle / angleSpread) * 2;

	const rotateAngle = (angle: number, polarity: Polarity) =>
		polarity === 'bi' ? angle : angle - angleSpread / 2;
	const derotateAngle = (angle: number, polarity: Polarity) =>
		polarity === 'bi' ? angle : angle + angleSpread / 2;

	let normalizedNumberParameter = $derived(normalizeNumberParameter(numberParameter, polarity));
	let mappedNumberParameter = $derived(mapNumberParameter(normalizedNumberParameter, linear));
	let nonRotatedAngle = $derived(mapToAngle(mappedNumberParameter, polarity));
	let angle = $derived(rotateAngle(nonRotatedAngle, polarity));

	// svelte-ignore state_referenced_locally
	let previousAngle = angle ?? 0;

	function handlePointerMove(event: PointerEvent) {
		event.preventDefault();
		event.stopPropagation();

		if (isDragging && draggingStartPosition && !discrete) {
			const factor = event.shiftKey ? 10 : 3;
			const { y } = draggingStartPosition;
			const { clientY } = event;
			const dy = y - clientY;
			const normalizedValueChange = dy / factor;

			const newAngle = previousAngle + normalizedValueChange;

			const newValue = denormalizeNumberParameter(
				demapNumberParameter(demapFromAngle(derotateAngle(newAngle, polarity), polarity), linear),
				polarity
			);

			onChange({
				parameterName,
				value: Math.max(minValue, Math.min(maxValue, newValue))
			});
		}

		if (isDragging && draggingStartPosition && discrete) {
			const factor = event.shiftKey ? 2 : 0.5;
			const { y } = draggingStartPosition;
			const { clientY } = event;
			const dy = y - clientY;
			const normalizedValueChange = dy / factor;

			const newAngle = previousAngle + normalizedValueChange;

			const newValue = denormalizeNumberParameter(
				demapNumberParameter(demapFromAngle(derotateAngle(newAngle, polarity), polarity), linear),
				polarity
			);

			if (newValue >= numberParameter + 1 || newValue <= numberParameter - 1) {
				onChange({
					parameterName,
					value: Math.max(minValue, Math.min(maxValue, Math.round(newValue)))
				});
			}
		}
	}

	let animating = $state(false);

	const bufferLength = audioParamAnalyser?.frequencyBinCount;
	const dataArray = new Float32Array(bufferLength ?? 0);

	let animatedValue = $state(0);

	function animateAudioParam() {
		if (audioParamAnalyser && isControlled && animating) {
			audioParamAnalyser.getFloatTimeDomainData(dataArray);

			animatedValue = dataArray[0] ?? 0;

			requestAnimationFrame(animateAudioParam);
		} else {
			animatedValue = 0;
		}
	}

	let highlightStyle = $state('');

	const handleClick = (event: MouseEvent) => {
		if (event.detail === 2) {
			onChange({
				parameterName,
				value: defaultValue
			});
		}
	};

	let numberParameterInput = $state(false);
	// svelte-ignore state_referenced_locally
	let editedNumber = $state(numberParameter);

	const handleParameterValueClick = (event: PointerEvent) => {
		event.stopPropagation();
		event.preventDefault();

		numberParameterInput = true;
		editedNumber = Number(numberParameter.toFixed(2));

		window.addEventListener('pointerup', closeInput, { capture: true, once: true });
		window.addEventListener('pointerdown', (e) => e.stopPropagation(), {
			capture: true,
			once: true
		});
	};

	let input: HTMLInputElement | undefined = $state();

	const closeInput = (event: PointerEvent) => {
		event.stopPropagation();

		if (event.target === input) {
			window.addEventListener('pointerup', closeInput, { capture: true, once: true });
			window.addEventListener('pointerdown', (e) => e.stopPropagation(), {
				capture: true,
				once: true
			});
			return;
		}

		numberParameterInput = false;
	};

	const handleInputEnter = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			numberParameterInput = false;

			onChange({
				parameterName,
				value: Math.min(maxValue, Math.max(minValue, editedNumber))
			});
		}
	};
	let hoveringOverWhileDraggingLine = $derived(hoveringOver && draggingLine);
	let isControlled = $derived(parameter.inputs.length > 0 || hoveringOverWhileDraggingLine);

	$effect(() => {
		knobWrapper && onKnobCreated && onKnobCreated(knobWrapper);
	});

	$effect(() => {
		if (isControlled && !animating && audioParamAnalyser) {
			animating = true;
			animateAudioParam();
		} else if (!isControlled && animating) {
			animating = false;
		}
	});

	let sum = $derived(animatedValue + numberParameter);
	let normalizedSum = $derived(normalizeNumberParameter(sum, polarity));
	let mappedSum = $derived(mapNumberParameter(normalizedSum, linear));
	let clippedSum = $derived(
		polarity === 'uni' ? Math.max(0, Math.min(1, mappedSum)) : Math.max(-1, Math.min(1, mappedSum))
	);

	$effect(() => {
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
	});
</script>

<div
	class="wrapper"
	data-knob
	data-node-id={nodeId}
	data-parameter-name={parameterName}
	data-node-order={nodeOrder}
	bind:this={knobWrapper}
>
	<div class="title">{rewriteStringWithNumber(parameterName)}</div>
	<div class="knob-wrapper" style={highlightStyle}>
		<div
			class="knob"
			onpointerdown={handlePointerDown}
			onpointerup={handlePointerUp}
			onmouseenter={handleMouseEnter}
			onmouseleave={handleMouseLeave}
			onclick={handleClick}
			tabindex={0}
			role="spinbutton"
			onkeypress={() => {}}
			style="transform: rotate({angle}deg)"
		>
			<div class="knob-pointer"></div>
			<div class:visible={isControlled} class="controlled-knob-circle"></div>
		</div>
	</div>
	{#if numberParameterInput}
		<!-- svelte-ignore a11y_autofocus -->
		<input
			bind:this={input}
			autofocus
			type="number"
			bind:value={editedNumber}
			onkeydown={handleInputEnter}
		/>
	{:else if numberParameter !== null}
		<div
			class="value"
			onpointerdown={(e) => e.stopPropagation()}
			onpointerup={handleParameterValueClick}
		>
			{#if !discrete}
				{numberParameter.toFixed(2)}
			{:else}
				{numberParameter}
			{/if}
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
		gap: 8px;
		min-width: 80px;
		touch-action: none;
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
		user-select: none;
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
