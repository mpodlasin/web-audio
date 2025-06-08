<script lang="ts">
	interface Props {
		variant?: 'default' | 'danger';
		children?: import('svelte').Snippet;
		onClick?(event: MouseEvent): void;
		onTouchStart?(): void;
	}

	let { variant = 'default', children, onClick, onTouchStart }: Props = $props();

	const stopPropagation = (event: Event) => {
		event.stopPropagation();
	};
</script>

<button
	onclick={onClick}
	ontouchstart={onTouchStart}
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
