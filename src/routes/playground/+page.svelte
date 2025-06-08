<script lang="ts">
	import type { Position, SerializedAudioElements } from '../../audio/serialized';
	import { loadCustomNodes } from '../../audio/web-audio/utils';
	import AudioCanvas from '../../components/AudioCanvas.svelte';
	import { createProject, type Projects } from '../../ui/project';

	const customNodesPromise = loadCustomNodes();

	const audioGraphLocalStorageKey = 'audioGraph';

	const projectsString = localStorage.getItem(audioGraphLocalStorageKey);

	let projects: Projects = $state(
		projectsString !== null
			? JSON.parse(projectsString)
			: {
					'Project 1': createProject('Project 1')
				}
	);

	let projectNames = $derived(
		Object.values(projects)
			.slice()
			.sort((a, b) => new Date(b.lastChanged).valueOf() - new Date(a.lastChanged).valueOf())
			.map((project) => project.name)
	);

	let chosenProjectName = $state('');

	$effect(() => {
		if (!chosenProjectName) {
			chosenProjectName = projectNames[0] ?? 'Project 1';
		}
	});

	let chosenProject = $derived(projects[chosenProjectName]);

	$effect(() => {
		localStorage.setItem(audioGraphLocalStorageKey, JSON.stringify(projects));
	});

	const handleChange = (audioCanvas: SerializedAudioElements) => {
		if (!chosenProject) return;

		projects = {
			...projects,
			[chosenProjectName]: {
				...chosenProject,
				lastChanged: new Date(Date.now()).toISOString(),
				audioCanvas
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

	const handleProjectChange = (projectName: string) => {
		chosenProjectName = projectName;
	};

	const handleProjectDelete = (projectName: string) => {
		const projectsCopy = {
			...projects
		};

		delete projectsCopy[projectName];

		if (Object.entries(projectsCopy).length === 0) {
			projects = {
				'Project 1': createProject('Project 1')
			};

			if (projectName === 'Project 1') {
				window.location.reload();
			}
		} else {
			projects = projectsCopy;
		}

		const newProjectNames = Object.values(projects).map((project) => project.name);

		if (chosenProjectName === projectName) {
			chosenProjectName = newProjectNames[0]!;
		}
	};

	const handleProjectNameChange = (event: { oldName: string; newName: string }) => {
		const { newName, oldName } = event;

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

	const handleSizeChange = (size: number) => {
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

	const handleCanvasRelativePositionChange = (position: Position) => {
		const { x, y } = position;

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
				onChange={handleChange}
				onNewProject={handleNewProject}
				onProjectChange={handleProjectChange}
				onProjectDelete={handleProjectDelete}
				onProjectNameChange={handleProjectNameChange}
				onSizeChange={handleSizeChange}
				onCanvasRelativePositionChange={handleCanvasRelativePositionChange}
			/>
		{/key}
	{/if}
{/await}
