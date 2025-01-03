<script lang="ts">
	import type { Position, SerializedAudioElements } from '../../audio/serialized';
	import { loadCustomNodes } from '../../audio/web-audio/utils';
	import AudioCanvas from '../../components/AudioCanvas.svelte';
	import { createProject, type Projects } from '../../ui/project';

	const customNodesPromise = loadCustomNodes();

	const audioGraphLocalStorageKey = 'audioGraph';

	const projectsString = localStorage.getItem(audioGraphLocalStorageKey);

	let projects: Projects =
		projectsString !== null
			? JSON.parse(projectsString)
			: {
					'Project 1': createProject('Project 1')
			  };

	$: projectNames = Object.values(projects)
		.slice()
		.sort((a, b) => new Date(b.lastChanged).valueOf() - new Date(a.lastChanged).valueOf())
		.map((project) => project.name);

	let chosenProjectName = '';

	$: {
		if (!chosenProjectName) {
			chosenProjectName = projectNames[0] ?? 'Project 1';
		}
	}

	$: chosenProject = projects[chosenProjectName];

	$: {
		localStorage.setItem(audioGraphLocalStorageKey, JSON.stringify(projects));
	}

	const handleChange = (event: CustomEvent<SerializedAudioElements>) => {
		if (!chosenProject) return;

		projects = {
			...projects,
			[chosenProjectName]: {
				...chosenProject,
				lastChanged: new Date(Date.now()).toISOString(),
				audioCanvas: event.detail
			}
		};
	};

	const handleNewProject = () => {
		chosenProjectName = `Project ${projectNames.length + 1}`;

		projects = {
			...projects,
			[chosenProjectName]: createProject(chosenProjectName)
		};
	};

	const handleProjectChange = (event: CustomEvent<string>) => {
		chosenProjectName = event.detail;
	};

	const handleProjectDelete = (event: CustomEvent<string>) => {
		const projectsCopy = {
			...projects
		};

		delete projectsCopy[event.detail];

		if (Object.entries(projectsCopy).length === 0) {
			projects = {
					'Project 1': createProject('Project 1')
			  };

			  if (event.detail === 'Project 1') {
				window.location.reload();
			  }
		} else {
			projects = projectsCopy;
		}

		const newProjectNames = Object.values(projects).map(project => project.name);

		if (chosenProjectName === event.detail) {
			chosenProjectName = newProjectNames[0]!;
		}
	};

	const handleProjectNameChange = (event: CustomEvent<{ oldName: string; newName: string }>) => {
		const { newName, oldName } = event.detail;

		const project = projects[oldName];

		if (!project) return;

		const newProjects = {
			...projects,
			[newName]: {
				...project,
				name: newName
			}
		};

		delete newProjects[oldName];

		projects = newProjects;

		if (chosenProjectName === oldName) {
			chosenProjectName = newName;
		}
	};

	const handleSizeChange = (event: CustomEvent<number>) => {
		const size = event.detail;

		const project = projects[chosenProjectName];

		if (!project) return;

		projects = {
			...projects,
			[chosenProjectName]: {
				...project,
				size
			}
		};
	};

	const handleCanvasRelativePositionChange = (event: CustomEvent<Position>) => {
		const { x, y } = event.detail;

		const project = projects[chosenProjectName];

		if (!project) return;

		projects = {
			...projects,
			[chosenProjectName]: {
				...project,
				canvasRelativePosition: { x, y }
			}
		};
	};
</script>

{#await customNodesPromise}
	Loading...
{:then}
	{#if chosenProject !== undefined}
		{#key chosenProjectName}
			<AudioCanvas
				{projectNames}
				{chosenProjectName}
				project={chosenProject}
				on:change={handleChange}
				on:newProject={handleNewProject}
				on:projectChange={handleProjectChange}
				on:projectDelete={handleProjectDelete}
				on:projectNameChange={handleProjectNameChange}
				on:sizeChange={handleSizeChange}
				on:canvasRelativePositionChange={handleCanvasRelativePositionChange}
			/>
		{/key}
	{/if}
{/await}
