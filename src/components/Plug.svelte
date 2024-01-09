<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Menu from './Menu.svelte';
	import type { StaticInputOutputDefinition } from '../audio/AudioCanvas';

	export let id: string;
	export let type: 'input' | 'output';
	export let staticDefinition: StaticInputOutputDefinition;
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

<div class="wrapper">
	<div
		class="plug"
		bind:this={plug}
		on:mousedown={handlePlugClick}
		on:mouseup={handlePlugUp}
	/>
	<div class="menu">
		<Menu>
			<h2>{staticDefinition.name}</h2>
			<p>{staticDefinition.description}</p>
			<p>Range {staticDefinition.minValue} to {staticDefinition.maxValue} {staticDefinition.unit ?? ''}</p>
		</Menu>
	</div>
</div>

<style>
	.wrapper {
		position: relative;
	}

	.menu {
		position: absolute;
		top: 6px;
		left: 6px;
		transition: opacity 0.5s;
		transition-delay: 1s;
		opacity: 0;
		pointer-events: none;
	}

	.wrapper:hover .menu {
		opacity: 1;
	}

	.plug {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: var(---neutral-700);
		border: 2px solid var(--neutral-500);
	}

	.menu h2 {
		font-size: 12px;
		font-weight: bold;
		text-transform: capitalize;
	}

	.menu p {
		font-size: 10px;
	}
</style>
