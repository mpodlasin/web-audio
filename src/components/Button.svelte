<script lang="ts">
	export let title: string;
	export let variant: 'default' | 'danger' = 'default';
</script>

<button on:click class:danger={variant === 'danger'}>{title}</button>

<style>
	button {
		background-color: var(--neutral-900);
		border: 1px solid var(--neutral-300);
		color: var(--neutral-300);
		padding: 8px 12px;
		border-radius: 8px;

		transition: background-color 0.2s;
		cursor: pointer;
	}

	button:hover {
		background-color: var(--neutral-700);
	}

	.danger {
		color: var(--danger-300);
		border: 1px solid var(--danger-300);
	}
</style>
