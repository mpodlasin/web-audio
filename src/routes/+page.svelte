<script lang="ts">
	import type { SerializedAudioElements } from '../audio/serialized';
	import { loadCustomNodes } from '../audio/web-audio/utils';
	import AudioCanvas from '../components/AudioCanvas.svelte';
	import { createProject, type Projects } from '../ui/project';

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
		.sort((a, b) => b.lastChanged.valueOf() - a.lastChanged.valueOf())
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
				lastChanged: new Date(Date.now()),
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

		projects = projectsCopy;

		if (chosenProjectName === event.detail) {
			chosenProjectName = projectNames[0] ?? 'Project 1';
		}
	};

	const handleProjectNameChange = (event: CustomEvent<{ oldName: string; newName: string }>) => {
		const { newName, oldName } = event.detail;

		const project = projects[oldName];

		if (!project) return;

		const newProjects = {
			...projects,
			[newName]: project
		};

		delete newProjects[oldName];

		projects = newProjects;

		if (chosenProjectName === oldName) {
			chosenProjectName = newName;
		}
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
			/>
		{/key}
	{/if}
{/await}
