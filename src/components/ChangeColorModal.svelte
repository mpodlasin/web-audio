<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';
	interface Props {
		open: boolean;
		value?: string;
		node?: import('svelte').Snippet;
	}

	let { open, value = '#45c7ff', node }: Props = $props();

	const dispatcher = createEventDispatcher();

	const handleColorChange = (event: any) => {
		dispatcher('change', event.target.value as string);
	};

	const handleConfirmChange = () => {
		dispatcher('confirm');
	};

	const handleCancelChange = () => {
		dispatcher('close');
	};
</script>

<Modal {open} on:close>
	<div>Change color</div>
	<div class="content">
		{@render node?.()}
		<input type="color" oninput={handleColorChange} {value} />
	</div>
	<div class="actions">
		<Button title="Change" on:click={handleConfirmChange} />
		<Button title="Cancel" on:click={handleCancelChange} />
	</div>
</Modal>

<style>
	.content {
		padding-top: 36px;
		display: flex;
		gap: 24px;
		justify-content: space-evenly;
	}

	.actions {
		padding-top: 36px;
	}
</style>
