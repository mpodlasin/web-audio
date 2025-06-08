<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
		onClick?(): void;
		onKeyDown?(): void;
		onMouseUp?(): void;
	}

	let { children, onClick, onKeyDown, onMouseUp }: Props = $props();
	const stopPropagation = (event: Event) => {
		event.stopPropagation();
	};
</script>

<div
	onclick={onClick}
	onkeydown={onKeyDown}
	onmouseup={onMouseUp}
	role="menu"
	tabindex={0}
	class="wrapper"
	onpointerdown={stopPropagation}
	onpointerup={stopPropagation}
>
	{@render children?.()}
</div>

<style>
	.wrapper {
		border-radius: 8px;
		border-top-left-radius: 0px;
		border: 1px solid var(--neutral-500);
		background-color: var(--neutral-900);

		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 8px;

		z-index: 100;

		box-shadow: 3px 4px 19px -5px rgba(0, 0, 0, 0.6);
	}
</style>
