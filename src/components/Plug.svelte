<script lang="ts">
	import Menu from './Menu.svelte';
	import type { StaticInputOutputDefinition } from '../audio/AudioCanvas';

	let plug: HTMLButtonElement | undefined = $state();

	interface Props {
		nodeId: string;
		id: string;
		type: 'input' | 'output';
		staticDefinition: StaticInputOutputDefinition;
		onPlugCreated?(plug: HTMLElement): void;
		onPlugMouseDown(event: { id: string; type: 'input' | 'output'; event: PointerEvent }): void;
		onPlugMouseUp(event: { id: string; type: 'input' | 'output'; event: PointerEvent }): void;
	}

	let { nodeId, id, type, staticDefinition, onPlugCreated, onPlugMouseDown, onPlugMouseUp }: Props =
		$props();

	$effect(() => {
		plug && onPlugCreated?.(plug);
	});

	let minValue = $derived(
		staticDefinition.minValue === -Infinity ? '-infinity' : staticDefinition.minValue
	);
	let maxValue = $derived(
		staticDefinition.maxValue === Infinity ? 'infinity' : staticDefinition.maxValue
	);

	const handlePlugDown = (event: PointerEvent) => {
		event.stopPropagation();
		event.preventDefault();

		onPlugMouseDown({ id, type, event });
	};

	const handlePlugUp = (event: PointerEvent) => {
		event.stopPropagation();
		event.preventDefault();

		onPlugMouseUp({ id, type, event });
	};
</script>

<div class="wrapper">
	<button
		class="plug"
		data-plug={type}
		onpointerup={handlePlugUp}
		onpointerdown={handlePlugDown}
		onkeydown={() => {}}
		data-id={id}
		data-node-id={nodeId}
		data-type={type}
		aria-label="Plug"
		bind:this={plug}
	>
	</button>
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
		border: 1px solid var(--primary-500);
		transition: transform 0.2s;
	}

	.plug:hover {
		transform: scaleX(120%) scaleY(120%);
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
