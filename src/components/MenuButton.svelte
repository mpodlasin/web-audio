<script lang="ts">
	export let variant: 'default' | 'danger' = 'default';

	const stopPropagation = (event: Event) => {
		event.stopPropagation();
	};
</script>

<button on:click on:touchstart on:keypress class:danger={variant === 'danger'} on:pointerdown={stopPropagation} on:pointerup={stopPropagation}>
	<slot />
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
