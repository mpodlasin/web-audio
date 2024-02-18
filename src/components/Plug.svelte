<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Menu from './Menu.svelte';
	import type { StaticInputOutputDefinition } from '../audio/AudioCanvas';

	let plug: HTMLDivElement;

	export let nodeId: string;
	export let id: string;
	export let type: 'input' | 'output';
	export let staticDefinition: StaticInputOutputDefinition;

	const dispatcher = createEventDispatcher();

	$: {
		dispatcher('plugCreated', plug);
	}

	$: minValue = staticDefinition.minValue === -Infinity ? '-infinity' : staticDefinition.minValue;
	$: maxValue = staticDefinition.maxValue === Infinity ? 'infinity' : staticDefinition.maxValue;

	const handlePlugClick = (event: MouseEvent) => {
		event.stopPropagation();
		event.preventDefault();

		dispatcher('click', { id, type });
	};

	const handlePlugUp = (event: PointerEvent) => {
		event.stopPropagation();
		event.preventDefault();

		dispatcher('up', { id, type, event });
	};
</script>

<div class="wrapper">
	<div
		class="plug"
		data-plug={type}
		on:click={handlePlugClick}
		on:pointerup={handlePlugUp}
		on:keydown={() => {}}
		data-id={id}
		data-node-id={nodeId}
		data-type={type}
		bind:this={plug}
	/>
	<div class="menu">
		<Menu>
			<div class="menu-content">
				<h2>{type}:<span class="name">{staticDefinition.name}</span></h2>
				{#if staticDefinition.description}
					<p>{staticDefinition.description}</p>
				{/if}
				{#if staticDefinition.contextDescription}
					<p>{staticDefinition.contextDescription}</p>
				{/if}
				<p>Range: {minValue} to {maxValue} {staticDefinition.unit ?? ''}</p>
			</div>
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
		z-index: 100;
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
		text-align: center;
		color: var(--neutral-500);
		text-transform: uppercase;
		font-size: 10px;
		margin: 0;
	}

	.menu p {
		font-size: 10px;
		margin: 0;
		text-align: center;
		white-space: pre;
		line-height: 1.7;
	}

	.menu-content {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.name {
		color: var(--primary-500);
		padding-left: 4px;
	}
</style>
