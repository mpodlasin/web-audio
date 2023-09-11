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

	const handlePlugClick = (event: any) => {
		event.stopPropagation();
		event.preventDefault();

		dispatcher('click', { id, type });
	};

	const handlePlugUp = (event: any) => {
		event.stopPropagation();
		event.preventDefault();

		dispatcher('up', { id, type });
	};
</script>

<div class="plug" bind:this={plug} on:mousedown={handlePlugClick} on:mouseup={handlePlugUp} />

<style>
	.plug {
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background-color: #fff;
		border: 1px solid #000;
		z-index: -1;
	}
</style>
