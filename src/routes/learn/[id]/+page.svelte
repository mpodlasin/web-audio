<script lang="ts">
	import type { Position, SerializedAudioElements } from '../../../audio/serialized';
	import { loadCustomNodes } from '../../../audio/web-audio/utils';
	import AudioCanvas from '../../../components/AudioCanvas.svelte';
	import { createTutorialProject, type Projects } from '../../../ui/project';

	let { data } = $props();

	const id = data.id!;
	const route = data.route!;

	const chosenProjectName = route.title;

	const customNodesPromise = loadCustomNodes();

	const localStorageKey = 'tutorials';

	const tutorialsString = localStorage.getItem(localStorageKey);

	let tutorials: Projects = $state(tutorialsString !== null ? JSON.parse(tutorialsString) : {});

	// svelte-ignore state_referenced_locally
	let chosenTutorial = $state(tutorials[id]);

	$effect(() => {
		if (!chosenTutorial) {
			tutorials = {
				...tutorials,
				[id]: createTutorialProject(chosenProjectName, route.tutorialId)
			};
		}

		chosenTutorial = tutorials[id];
	});

	$effect(() => {
		localStorage.setItem(localStorageKey, JSON.stringify(tutorials));
	});

	const handleChange = (audioCanvas: SerializedAudioElements) => {
		if (!chosenTutorial) return;

		tutorials = {
			...tutorials,
			[id]: {
				...chosenTutorial,
				lastChanged: new Date(Date.now()).toISOString(),
				audioCanvas
			}
		};
	};

	const handleSizeChange = (size: number) => {
		if (!chosenTutorial) return;

		tutorials = {
			...tutorials,
			[id]: {
				...chosenTutorial,
				size
			}
		};
	};

	const handleCanvasRelativePositionChange = (canvasRelativePosition: Position) => {
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
				onChange={handleChange}
				onSizeChange={handleSizeChange}
				onCanvasRelativePositionChange={handleCanvasRelativePositionChange}
			/>
		{/key}
	{/if}
{/await}
