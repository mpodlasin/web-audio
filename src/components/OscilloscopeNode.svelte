<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { CustomOscilloscopeNode } from '../audio/initialized';
	import type { SerializedOscilloscopeNode } from '../audio/serialized';
	import OnOffButton from './OnOffButton.svelte';

	export let id: string;
	export let serializedNode: SerializedOscilloscopeNode;
	export let oscilloscopeNode: CustomOscilloscopeNode;
	export let running: boolean;

	const dispatcher = createEventDispatcher();

	$: slowParameter = serializedNode.parameters?.slow;

	const handleSlowModeChange = (event: CustomEvent<{ parameterName: string; value: number }>) => {
		dispatcher('nodeParameterChange', {
			id,
			parameterName: event.detail.parameterName,
			value: event.detail.value
		});
	};

	$: mode = 'slow';

	let primaryColor = '#45C7FF';
	let neutralColor = '#FFFFFF';

	$: {
		if (canvas) {
			primaryColor = window.getComputedStyle(canvas).getPropertyValue('--primary-500');
			neutralColor = window.getComputedStyle(canvas).getPropertyValue('--neutral-900');
		}
	}

	$: analyser = oscilloscopeNode.webApiNode;
	$: bufferLength = analyser.frequencyBinCount;
	$: dataArray = new Uint8Array(bufferLength);

	let canvas: HTMLCanvasElement;
	$: canvasCtx = canvas?.getContext('2d') ?? null;

	let lastPosition = 0;

	function drawSlowMode() {
		if (!running) return;
		if (canvasCtx === null) return;
		if (!canvas) return;
		if (!analyser) return;
		if (mode !== 'slow') return;

		requestAnimationFrame(drawSlowMode);

		analyser.getByteTimeDomainData(dataArray);

		canvasCtx.lineWidth = 1;
		canvasCtx.strokeStyle = primaryColor;
		canvasCtx.fillStyle = primaryColor;

		const v = (dataArray[0] ?? 128) / 128.0;
		const v2 = 2 - v;
		const y = (v2 * canvas.height) / 2;

		canvasCtx.beginPath();

		canvasCtx.moveTo(canvas.width - 2, lastPosition);
		canvasCtx.lineTo(canvas.width - 1, y);

		canvasCtx.stroke();

		lastPosition = y;

		canvasCtx.globalCompositeOperation = 'copy';
		canvasCtx.drawImage(canvasCtx.canvas, -1, 0);
		canvasCtx.globalCompositeOperation = 'source-over';
	}

	function drawFastMode() {
		if (!running) return;
		if (canvasCtx === null) return;
		if (!canvas) return;
		if (!analyser) return;
		if (mode !== 'fast') return;

		requestAnimationFrame(drawFastMode);

		analyser.getByteTimeDomainData(dataArray);

		canvasCtx.fillStyle = neutralColor;
		canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

		canvasCtx.lineWidth = 2;
		canvasCtx.strokeStyle = primaryColor;

		canvasCtx.beginPath();

		const sliceWidth = (canvas.width * 1.0) / bufferLength;
		let x = 0;

		for (let i = 0; i < bufferLength; i++) {
			const v = (dataArray[i] ?? 0) / 128.0;
			const y = (v * canvas.height) / 2;

			if (i === 0) {
				canvasCtx.moveTo(x, y);
			} else {
				canvasCtx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		canvasCtx.lineTo(canvas.width, canvas.height / 2);
		canvasCtx.stroke();
	}

	let started = false;

	$: {
		if (running && canvasCtx && !started) {
			if (mode === 'fast') {
				drawFastMode();
			} else {
				drawSlowMode();
			}
			started = true;
		}
	}
</script>

<div class="container">
	<canvas bind:this={canvas} />
	<!-- <OnOffButton label="slow" active={slowParameter?.base === 1} on:change={handleSlowModeChange} /> -->
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1em;
	}
	canvas {
		border: 1px solid var(--neutral-500);
		border-radius: 4px;
	}
</style>
