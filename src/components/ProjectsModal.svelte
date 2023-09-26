<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Menu from './Menu.svelte';
	import Button from './Button.svelte';
	import Close from '../icons/Close_MD.svg?component';
	import More from '../icons/More_Vertical.svg?component';
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

	const handleNewProject = () => {
		disaptcher('newProject');
	};

	const handleChangeProject = (projectName: string) => () => {
		disaptcher('projectChange', projectName);
	};

	let showMoreMenuForProject = '';

	const handleMoreClick = (projectName: string) => (event: MouseEvent) => {
		event.stopPropagation();

		showMoreMenuForProject = projectName;

		window.addEventListener('click', closeMoreMenu);
	};

	const closeMoreMenu = () => {
		showMoreMenuForProject = '';
		window.removeEventListener('click', closeMoreMenu);
	};

	const handleDeleteProject = (projectName: string) => (event: MouseEvent) => {
		event.stopPropagation();
		disaptcher('projectDelete', projectName);
		showMoreMenuForProject = '';
	};

	let renameModeForProject = '';
	let renamedProject = '';

	const handleRenameProject = (projectName: string) => (event: MouseEvent) => {
		event.stopPropagation();
		showMoreMenuForProject = '';
		renamedProject = projectName;
		renameModeForProject = projectName;
	};

	const confirmNameChange = () => {
		disaptcher('projectNameChange', {
			oldName: renameModeForProject,
			newName: renamedProject
		});

		renameModeForProject = '';
		renamedProject = '';
	};

	const handleEnter = (event: KeyboardEvent) => {
		if (event.key !== 'Enter') return;

		event.preventDefault();

		confirmNameChange();
	};
</script>

<dialog bind:this={dialog}>
	<div class="close" on:click={handleClose} on:keypress={() => {}}>
		<Close />
	</div>
	Projects
	<div class="projects">
		{#each projects as project (project)}
			<div class="project" on:click={handleChangeProject(project)} on:keydown={() => {}}>
				{#if renameModeForProject === project}
					<!-- svelte-ignore a11y-autofocus -->
					<input type="text" bind:value={renamedProject} autofocus on:keydown={handleEnter} />
				{:else}
					{project}
				{/if}
				<div class="more" on:click={handleMoreClick(project)} on:keydown={() => {}}><More /></div>
				{#if showMoreMenuForProject === project}
					<div class="more-menu">
						<Menu>
							<Button title="Rename" on:click={handleRenameProject(project)} />
							<Button title="Delete" variant="danger" on:click={handleDeleteProject(project)} />
						</Menu>
					</div>
				{/if}
			</div>
		{/each}
		<div class="add" on:click={handleNewProject} on:keydown={() => {}}>+</div>
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
		position: relative;
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

	.more {
		position: absolute;
		top: 8px;
		right: 8px;
	}

	.more-menu {
		position: absolute;
		top: 14px;
		right: 14px;
		transform: translateX(100%);
		z-index: 10;
	}
</style>
