<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Close from '../icons/Close_MD.svg?component';
	export let projects: string[];
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
	Projects
	<div class="projects">
		{#each projects as project (project)}
			<div class="project">
				{project}
			</div>
		{/each}
		<div class="add">+</div>
	</div>
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
	}

	dialog::backdrop {
		backdrop-filter: blur(2px);
	}

	.projects {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 16px;
		padding: 32px;
	}

	.project,
	.add {
		border: 1px solid var(--neutral-500);
		border-radius: 8px;
		padding: 48px;
		transition: background-color 0.2s;
	}

	.project {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.add {
		font-size: 40px;
		color: var(--neutral-500);
	}

	.project:hover,
	.add:hover {
		background-color: var(--neutral-700);
		cursor: pointer;
	}

	.close {
		position: absolute;
		top: 32px;
		right: 32px;
		cursor: pointer;
	}
</style>
