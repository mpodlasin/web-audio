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
				x: plug.getBoundingClientRect().x + 7,
				y: plug.getBoundingClientRect().y + 7
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
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: var(---neutral-700);
		border: 2px solid var(--neutral-500);
	}
</style>
