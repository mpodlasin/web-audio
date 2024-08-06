<script lang="ts">
	import type { CustomValueNode } from '../audio/initialized';

	export let valueNode: CustomValueNode;
	export let running: boolean;

	$: analyser = valueNode.webApiNode;
	$: bufferLength = analyser.frequencyBinCount;
	$: dataArray = new Float32Array(bufferLength);
	$: value = dataArray[0] ?? 0;

	let drawing = false;

	function draw() {
		if (!running || !analyser) {
			drawing = false;
			return;
		}

		requestAnimationFrame(draw);

		analyser.getFloatTimeDomainData(dataArray);

		value = dataArray[0] ?? 0;
	}

	$: {
		if (running && !drawing) {
			draw();
			drawing = true;
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
