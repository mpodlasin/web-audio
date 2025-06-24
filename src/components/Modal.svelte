<script lang="ts">
	import Close from '../icons/Close_MD.svg?component';
	interface Props {
		open: boolean;
		children?: import('svelte').Snippet;
		onClose(): void;
	}

	let { open, children, onClose }: Props = $props();
	let dialog: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (dialog) {
			if (open) {
				dialog.showModal();
			} else {
				dialog.close();
			}
		}
	});

	const stopPropagation = (event: Event) => {
		event.stopPropagation();
	};

	const handleClose = () => {
		onClose();
	};
</script>

<dialog bind:this={dialog} onpointerdown={stopPropagation} onpointerup={stopPropagation}>
	<button class="close" onclick={handleClose} onkeypress={() => {}}>
		<Close />
	</button>
	{@render children?.()}
</dialog>

<style>
	dialog {
		background-color: var(--neutral-900);
		color: var(--neutral-300);
		border: 1px solid var(--neutral-500);
		border-radius: 8px;
		outline: none;
		text-align: center;
		min-height: 40vh;
		padding: 32px;
		position: relative;
		min-width: 300px;
	}

	dialog::backdrop {
		backdrop-filter: blur(2px);
	}

	.close {
		position: absolute;
		top: 32px;
		right: 32px;
		cursor: pointer;
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
</style>
