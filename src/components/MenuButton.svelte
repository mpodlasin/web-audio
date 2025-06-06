<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	interface Props {
		variant?: 'default' | 'danger';
		children?: import('svelte').Snippet;
	}

	let { variant = 'default', children }: Props = $props();

	const stopPropagation = (event: Event) => {
		event.stopPropagation();
	};
</script>

<button
	onclick={bubble('click')}
	ontouchstart={bubble('touchstart')}
	onkeypress={bubble('keypress')}
	class:danger={variant === 'danger'}
	onpointerdown={stopPropagation}
	onpointerup={stopPropagation}
>
	{@render children?.()}
</button>

<style>
	button {
		padding: 4px 8px;
		position: relative;
		font-size: 14px;
		border-radius: 4px;
		transition: background-color 0.2s;
		cursor: pointer;
		white-space: nowrap;
		background-color: var(--neutral-900);
		border: none;
		outline: none;
		color: var(--neutral-300);
		text-align: left;
	}

	button:hover {
		background-color: var(--neutral-700);
	}

	button.danger {
		color: var(--danger-300);
	}
</style>
