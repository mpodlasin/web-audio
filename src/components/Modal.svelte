<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Close from '../icons/Close_MD.svg?component';
	export let open: boolean;
	let dialog: HTMLDialogElement;

	const disaptcher = createEventDispatcher();

	$: {
		if (dialog) {
			if (open) {
				dialog.showModal();
			} else {
				dialog.close();
			}
		}
	}

	const handleClose = () => {
		disaptcher('close');
	};
</script>

<dialog bind:this={dialog}>
	<div class="close" on:click={handleClose} on:keypress={() => {}}>
		<Close />
	</div>
	<slot />
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
	}
</style>
