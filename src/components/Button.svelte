<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	interface Props {
		title: string;
		variant?: 'default' | 'danger' | 'primary';
	}

	let { title, variant = 'default' }: Props = $props();

	const stopPropagation = (event: Event) => {
		event.stopPropagation();
	};
</script>

<button
	onclick={bubble('click')}
	class:danger={variant === 'danger'}
	class:primary={variant === 'primary'}
	onpointerdown={stopPropagation}
	onpointerup={stopPropagation}
>
	{title}
</button>

<style>
	button {
		background-color: var(--neutral-900);
		border: 1px solid var(--neutral-300);
		color: var(--neutral-300);
		padding: 8px 12px;
		border-radius: 8px;

		transition: background-color 0.2s;
		cursor: pointer;

		white-space: nowrap;
	}

	button:hover {
		background-color: var(--neutral-700);
	}

	.danger {
		color: var(--danger-300);
		border: 1px solid var(--danger-300);
	}

	.primary {
		color: var(--primary-500);
		border: 1px solid var(--primary-500);
	}
</style>
