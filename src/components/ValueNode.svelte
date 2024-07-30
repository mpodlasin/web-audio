<script lang="ts">
	import type { CustomValueNode } from '../audio/initialized';

	export let valueNode: CustomValueNode;
	export let running: boolean;

	$: analyser = valueNode.webApiNode;
	$: bufferLength = analyser.frequencyBinCount;
	$: dataArray = new Float32Array(bufferLength);
	$: value = dataArray[0] ?? 0;

	function draw() {
		if (!running) return;
		if (!analyser) return;

		requestAnimationFrame(draw);

		analyser.getFloatTimeDomainData(dataArray);

		value = dataArray[0] ?? 0;
	}

	let started = false;

	$: {
		if (running && !started) {
			draw();
			started = true;
		}
	}
</script>

<div class="container">
	{value.toFixed(2)}
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		font-size: 14px;
		margin-right: 4px;
	}
</style>
