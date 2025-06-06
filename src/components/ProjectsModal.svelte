<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Menu from './Menu.svelte';
	import Button from './Button.svelte';
	import More from '../icons/More_Vertical.svg?component';
	import Modal from './Modal.svelte';
	interface Props {
		projects: string[];
		open: boolean;
	}

	let { projects, open }: Props = $props();

	const disaptcher = createEventDispatcher();

	const handleNewProject = () => {
		disaptcher('newProject');
	};

	const handleChangeProject = (projectName: string) => () => {
		if (showMoreMenuForProject || renameModeForProject) return;

		disaptcher('projectChange', projectName);
	};

	let showMoreMenuForProject = $state('');

	const handleMoreClick = (projectName: string) => (event: MouseEvent) => {
		event.stopPropagation();

		showMoreMenuForProject = projectName;

		window.addEventListener('click', closeMoreMenu, { once: true });
	};

	const closeMoreMenu = () => {
		showMoreMenuForProject = '';
	};

	const handleDeleteProject = (projectName: string) => (event: MouseEvent) => {
		event.stopPropagation();
		disaptcher('projectDelete', projectName);
		showMoreMenuForProject = '';
	};

	let renameModeForProject = $state('');
	let renamedProject = $state('');

	const handleRenameProject = (projectName: string) => (event: MouseEvent) => {
		event.stopPropagation();
		showMoreMenuForProject = '';
		renamedProject = projectName;
		renameModeForProject = projectName;

		window.addEventListener('click', stopRenamingProject);
	};

	const stopRenamingProject = () => {
		renamedProject = '';
		renameModeForProject = '';

		window.removeEventListener('click', stopRenamingProject);
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

<Modal on:close {open}>
	Projects
	<div class="projects">
		{#each projects as project (project)}
			<div class="project" onclick={handleChangeProject(project)} onkeydown={() => {}}>
				{#if renameModeForProject === project}
					<!-- svelte-ignore a11y_autofocus -->
					<input type="text" bind:value={renamedProject} autofocus onkeydown={handleEnter} />
				{:else}
					{project}
				{/if}
				<div class="more" onclick={handleMoreClick(project)} onkeydown={() => {}}><More /></div>
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
		<div class="add" onclick={handleNewProject} onkeydown={() => {}}>
			<div class="plus">+</div>
		</div>
	</div>
</Modal>

<style>
	.projects {
		display: grid;
		grid-template-columns: repeat(3, 200px);
		gap: 16px;
		padding: 32px;
	}

	.project,
	.add {
		border: 1px solid var(--neutral-500);
		border-radius: 8px;
		padding: 8px;
		transition: background-color 0.2s;
		height: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.project {
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

	.plus {
		transform: translateY(-3px);
	}

	input {
		border: 1px solid var(--neutral-500);
		background-color: var(--neutral-900);
		outline: none;
		color: var(--neutral-300);
		padding: 4px 8px;
		border-radius: 4px;
	}
</style>
