<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let id: string;
	export let type: 'input' | 'output';
	let plug: HTMLElement;

	const dispatcher = createEventDispatcher();

	$: {
		if (plug) {
			dispatcher('plug', {
				id,
				type,
				x: plug.getBoundingClientRect().x,
				y: plug.getBoundingClientRect().y
			});
		}
	}
</script>

<div class="plug" bind:this={plug} />

<style>
	.plug {
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background-color: #fff;
		border: 1px solid #000;
	}
</style>
