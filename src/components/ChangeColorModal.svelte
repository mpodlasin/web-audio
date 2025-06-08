<script lang="ts">
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';
	interface Props {
		open: boolean;
		value?: string;
		node?: import('svelte').Snippet;
		onChange: (color: string) => void;
		onConfirm: () => void;
		onClose: () => void;
	}

	let { open, value = '#45c7ff', node, onChange, onClose, onConfirm }: Props = $props();

	const handleColorChange = (event: any) => {
		onChange(event.target.value as string);
	};
</script>

<Modal {open} {onClose}>
	<div>Change color</div>
	<div class="content">
		{@render node?.()}
		<input type="color" oninput={handleColorChange} {value} />
	</div>
	<div class="actions">
		<Button title="Change" onClick={onConfirm} />
		<Button title="Cancel" onClick={onClose} />
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
