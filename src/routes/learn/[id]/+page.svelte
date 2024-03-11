<script lang="ts">
	import type { Position, SerializedAudioElements } from '../../../audio/serialized';
	import { loadCustomNodes } from '../../../audio/web-audio/utils';
	import AudioCanvas from '../../../components/AudioCanvas.svelte';
	import { createTutorialProject, type Projects } from '../../../ui/project';

	export let data;

	const id = data.id!;
	const route = data.route!;

	console.log('route', route);

	const chosenProjectName = route.title;

	const customNodesPromise = loadCustomNodes();

	const localStorageKey = 'tutorials';

	const tutorialsString = localStorage.getItem(localStorageKey);

	let tutorials: Projects = tutorialsString !== null ? JSON.parse(tutorialsString) : {};

	let chosenTutorial = tutorials[id];

	$: console.log(chosenTutorial);

	$: {
		if (!chosenTutorial) {
			tutorials = {
				...tutorials,
				[id]: createTutorialProject(chosenProjectName, route.tutorialId)
			};

			chosenTutorial = tutorials[id];
		}
	}

	$: {
		localStorage.setItem(localStorageKey, JSON.stringify(tutorials));
	}

	const handleChange = (event: CustomEvent<SerializedAudioElements>) => {
		if (!chosenTutorial) return;

		tutorials = {
			...tutorials,
			[id]: {
				...chosenTutorial,
				lastChanged: new Date(Date.now()).toISOString(),
				audioCanvas: event.detail
			}
		};
	};

	const handleSizeChange = (event: CustomEvent<number>) => {
		const size = event.detail;
		if (!chosenTutorial) return;

		tutorials = {
			...tutorials,
			[id]: {
				...chosenTutorial,
				size
			}
		};
	};

	const handleCanvasRelativePositionChange = (event: CustomEvent<Position>) => {
		const canvasRelativePosition = event.detail;
		if (!chosenTutorial) return;

		tutorials = {
			...tutorials,
			[id]: {
				...chosenTutorial,
				canvasRelativePosition
			}
		};
	};
</script>

{#await customNodesPromise}
	Loading...
{:then}
	{#if chosenTutorial !== undefined}
		{#key chosenProjectName}
			<AudioCanvas
				{chosenProjectName}
				projectNames={[]}
				project={chosenTutorial}
				tutorialMode
				on:change={handleChange}
				on:sizeChange={handleSizeChange}
				on:canvasRelativePositionChange={handleCanvasRelativePositionChange}
			/>
		{/key}
	{/if}
{/await}
