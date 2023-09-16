<script lang="ts">
	import { globalContext } from '../audio/GlobalContext';
	import type { CustomOscilloscopeNode } from '../audio/initialized';

	export let oscilloscopeNode: CustomOscilloscopeNode;

	const color = '#45C7FF';

	$: analyser = oscilloscopeNode.webApiNode;
	$: bufferLength = analyser.frequencyBinCount;
	$: dataArray = new Uint8Array(bufferLength);

	let canvas: HTMLCanvasElement;
	$: canvasCtx = canvas?.getContext('2d') ?? null;

	const steps = 20;

	let lastPosition = 0;

	function draw() {
		requestAnimationFrame(draw);

		if (canvasCtx === null) return;
		if (!canvas) return;
		if (!analyser) return;

		analyser.getByteTimeDomainData(dataArray);

		canvasCtx.lineWidth = 1;
		canvasCtx.strokeStyle = color;
		canvasCtx.fillStyle = color;

		const v = (dataArray[0] ?? 128) / 128.0;
		const y = (v * canvas.height) / 2;

		canvasCtx.beginPath();

		canvasCtx.moveTo(canvas.width - 2, lastPosition);
		canvasCtx.lineTo(canvas.width - 1, y);

		canvasCtx.stroke();

		lastPosition = y;

		canvasCtx.globalCompositeOperation = 'copy';
		canvasCtx.drawImage(canvasCtx.canvas, -1, 0);
		canvasCtx.globalCompositeOperation = 'source-over';
	}

	draw();
</script>

<canvas bind:this={canvas} />

<style>
	canvas {
		border: 1px solid var(--neutral-500);
		border-radius: 4px;
	}
</style>
