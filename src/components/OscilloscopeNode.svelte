<script lang="ts">
	import type { CustomOscilloscopeNode } from '../audio/initialized';

	export let oscilloscopeNode: CustomOscilloscopeNode;

	$: analyser = oscilloscopeNode.webApiNode;
	$: bufferLength = analyser.frequencyBinCount;
	$: dataArray = new Uint8Array(bufferLength);

	let canvas: HTMLCanvasElement;
	$: canvasCtx = canvas?.getContext('2d') ?? null;

	function draw() {
		requestAnimationFrame(draw);

		if (canvasCtx === null) return;
		if (!canvas) return;
		if (!analyser) return;

		analyser.getByteTimeDomainData(dataArray);

		const sliceWidth = (canvas.width * 1.0) / bufferLength;

		canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

		canvasCtx.lineWidth = 2;
		canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

		canvasCtx.beginPath();

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

	draw();
</script>

<canvas bind:this={canvas} />

<style>
	canvas {
		border: 1px solid lightgray;
	}
</style>
