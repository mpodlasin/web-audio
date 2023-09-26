<script lang="ts">
	import { CustomAudioNodeWithWebApiAudioScheduledSourceNode } from '../audio/initialized';
	import type { SerializedAudioElements } from '../audio/serialized';
	import { loadCustomNodes } from '../audio/web-audio/utils';
	import AudioCanvas from '../components/AudioCanvas.svelte';

	const customNodesPromise = loadCustomNodes();

	const audioGraphLocalStorageKey = 'audioGraph';

	const projectsString = localStorage.getItem(audioGraphLocalStorageKey);

	let projects = (
		projectsString !== null
			? JSON.parse(projectsString)
			: {
					'Project 1': {}
			  }
	) as { [name: string]: SerializedAudioElements };

	$: projectNames = Object.keys(projects);

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
		projects = {
			...projects,
			[chosenProjectName]: event.detail
		};
	};

	const handleNewProject = () => {
		chosenProjectName = `Project ${projectNames.length + 1}`;
	};

	const handleProjectChange = (event: CustomEvent<string>) => {
		chosenProjectName = event.detail;
	};
</script>

{#await customNodesPromise}
	Loading...
{:then}
	{#key chosenProjectName}
		<AudioCanvas
			{projectNames}
			{chosenProjectName}
			initialAudioCanvas={chosenProject ?? {}}
			on:change={handleChange}
			on:newProject={handleNewProject}
			on:projectChange={handleProjectChange}
		/>
	{/key}
{/await}
