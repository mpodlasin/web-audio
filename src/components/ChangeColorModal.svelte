<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';
	export let open: boolean;
	export let value: string = '#45c7ff';

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
		<slot name="node" />
		<input type="color" on:input={handleColorChange} {value} />
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
