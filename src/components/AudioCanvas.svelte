<script lang="ts">
	import type { Position, SerializedAudioElements } from '../audio/serialized';
	import type { Project } from '../ui/project';
	import projects from './AudioCanvas/projects.svelte';
	import ProjectHeader from './ProjectHeader.svelte';
	import ProjectsModal from './ProjectsModal.svelte';

	interface Props {
		chosenProjectName: string;
		projectNames: string[];
		project: Project;
		tutorialMode?: boolean;
		onCanvasRelativePositionChange(position: Position): void;
		onNewProject?(): void;
		onProjectChange?(projectName: string): void;
		onSizeChange(size: number): void;
		onProjectDelete?(projectName: string): void;
		onProjectNameChange?(event: { oldName: string; newName: string }): void;
		onChange(audioGraph: SerializedAudioElements): void;
	}

	let {
		chosenProjectName,
		projectNames,
		project,
		tutorialMode = false,
		onCanvasRelativePositionChange,
		onNewProject,
		onProjectChange,
		onSizeChange,
		onProjectDelete,
		onProjectNameChange,
		onChange
	}: Props = $props();

	const { showProjectsModal, handleNewProject, handleCloseProjectsModal, handleProjectChange, handleProjectNameClick } =
		projects({ tutorialMode, onNewProject, onProjectChange });

    $effect(() => {
        console.log(showProjectsModal);
    });
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="canvas">
	<ProjectHeader projectName={chosenProjectName} playing={true} onProjectNameClick={handleProjectNameClick} />
	<ProjectsModal
		open={showProjectsModal}
		projects={projectNames}
		onClose={handleCloseProjectsModal}
		onNewProject={handleNewProject}
		onProjectChange={handleProjectChange}
		{onProjectDelete}
		{onProjectNameChange}
	/>
</div>

<style>
	.canvas {
		background-color: var(--neutral-700);
		overflow: hidden;
		position: relative;
		width: 100vw;
		height: 100vh;
		touch-action: none;
	}

	.audio-canvas {
		height: 100%;
	}

	svg {
		pointer-events: none;
		position: fixed;
		z-index: 10;
	}

	line.visible {
		stroke: var(--neutral-300);
	}

	.select {
		border: 1px solid var(--neutral-300);
		position: absolute;
		background-color: var(--neutral-500);
		opacity: 0.3;
	}

	.nodes-selected-header {
		font-size: 14px;
	}

	.nodes {
		transform-origin: top left;
	}

	.beta-info {
		position: absolute;
		bottom: 0;
		left: 0;
		font-size: 12px;
		background-color: var(--neutral-700);
	}
</style>
