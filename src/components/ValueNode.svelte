<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { CustomValueNode } from '../audio/initialized';

	interface Props {
		valueNode: CustomValueNode;
		running: boolean;
	}

	let { valueNode, running }: Props = $props();

	let analyser = $derived(valueNode.webApiNode);
	let bufferLength = $derived(analyser.frequencyBinCount);
	let dataArray = $derived(new Float32Array(bufferLength));
	let value = $derived(dataArray[0] ?? 0);

	let drawing = $state(false);

	function draw() {
		if (!running || !analyser) {
			drawing = false;
			return;
		}

		requestAnimationFrame(draw);

		analyser.getFloatTimeDomainData(dataArray);

		value = dataArray[0] ?? 0;
	}

	run(() => {
		if (running && !drawing) {
			draw();
			drawing = true;
		}
	});
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
