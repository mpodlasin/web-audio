<script lang="ts">
	import type { Position, SerializedAudioParameter } from '../audio/AudioCanvas';
	import { dragNode } from '../ui/dragNode';

	type Polarity = 'uni' | 'bi';

	interface Props {
		nodeId: string;
		parameterName: string;
		parameter: SerializedAudioParameter;
		defaultValue: number;
		minValue: number;
		maxValue: number;
		unit?: string | null;
		polarity: Polarity;
		draggingLine: boolean;
		linear?: boolean;
		discrete?: boolean;
		position: Position;
		onMouseDown(): void;
		onMouseUp(): void;
		onChange(event: { id: string; parameterName: string; value: number }): void;
	}

	let {
		nodeId,
		parameterName,
		parameter,
		defaultValue,
		minValue,
		maxValue,
		polarity,
		draggingLine,
		linear = false,
		discrete = false,
		position,
		onMouseDown,
		onMouseUp,
		onChange
	}: Props = $props();

	let mask: HTMLElement | undefined = $state();

	let numberParameter = $derived(parameter.base);

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

		onMouseUp();
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
				id: nodeId,
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
					id: nodeId,
					parameterName,
					value: Math.max(minValue, Math.min(maxValue, Math.round(newValue)))
				});
			}
		}
	}

	const handleClick = (event: MouseEvent) => {
		if (event.detail === 2) {
			onChange({
				id: nodeId,
				parameterName,
				value: defaultValue
			});
		}
	};
</script>

<button
	class="wrapper"
	class:draggingLine
	style="top: {position.y}px; left: {position.x}px;"
	data-knob
	data-node-id={nodeId}
	data-parameter-name={parameterName}
	onclick={handleClick}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	aria-label="knob"
	bind:this={mask}
>
</button>

<style>
	.wrapper {
		position: absolute;
		opacity: 0;
		width: 52px;
		height: 52px;
		background-color: pink;
		transform: translateY(-50%) translateX(-50%);
		z-index: 10;
		border-radius: 50%;
	}

	.draggingLine {
		pointer-events: none;
	}
</style>
