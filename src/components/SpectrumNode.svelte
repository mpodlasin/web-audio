<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { CustomSpectrumNode } from '../audio/initialized';

	interface Props {
		oscilloscopeNode: CustomSpectrumNode;
		running: boolean;
	}

	let { oscilloscopeNode, running }: Props = $props();

	let primaryColor = $state('#45C7FF');
	let neutralColor = $state('#FFFFFF');

	let canvas: HTMLCanvasElement = $state();

	let drawing = $state(false);

	function drawSpectrum() {
		if (!running || canvasCtx === null || !canvas || !analyser) {
			drawing = false;
			return;
		}

		requestAnimationFrame(drawSpectrum);

		analyser.getByteFrequencyData(dataArray);

		canvasCtx.fillStyle = neutralColor;
		canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

		canvasCtx.lineWidth = 2;
		canvasCtx.strokeStyle = primaryColor;

		canvasCtx.beginPath();

		const sliceWidth = (canvas.width * 1.0) / bufferLength;
		let x = 0;

		for (let i = 0; i < bufferLength; i++) {
			const v = (dataArray[i] ?? 0) / 256.0;
			const y = (1 - v) * canvas.height;

			if (i === 0) {
				canvasCtx.moveTo(x, y);
			} else {
				canvasCtx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		canvasCtx.stroke();
	}

	run(() => {
		if (canvas) {
			primaryColor = window.getComputedStyle(canvas).getPropertyValue('--primary-500');
			neutralColor = window.getComputedStyle(canvas).getPropertyValue('--neutral-900');
		}
	});
	let analyser = $derived(oscilloscopeNode.webApiNode);
	let bufferLength = $derived(analyser.frequencyBinCount);
	let dataArray = $derived(new Uint8Array(bufferLength));
	let canvasCtx = $derived(canvas?.getContext('2d') ?? null);
	run(() => {
		if (running && canvasCtx && !drawing) {
			drawSpectrum();
			drawing = true;
		}
	});
</script>

<div class="container">
	<div class="canvas-container">
		<div class="canvas-background">
			<div class="middle-line" />
		</div>
		<canvas bind:this={canvas} />
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		gap: 2px;
	}

	.canvas-container {
		position: relative;
	}

	canvas {
		border: 1px solid var(--neutral-500);
		position: relative;
		z-index: 1;
	}

	.canvas-background {
		position: absolute;
		top: 0;
		bottom: 4px; /* why? */
		left: 0;
		right: 0;
	}

	.middle-line {
		border-top: 1px dashed var(--neutral-500);
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
	}
</style>
