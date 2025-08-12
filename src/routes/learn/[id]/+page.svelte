<script lang="ts">
	import type { Position, SerializedAudioElements } from '../../../audio/serialized';
	import { loadCustomNodes } from '../../../audio/web-audio/utils';
	import AudioCanvas from '../../../components/AudioCanvas.svelte';
	import ProjectHeader from '../../../components/ProjectHeader.svelte';
	import { createTutorialProject, type Projects } from '../../../ui/project';
	import { localStorageItem } from '../../../utils/localStorage.svelte';

	let { data } = $props();

	const id = data.id!;
	const route = data.route!;

	const chosenProjectName = route.title;

	const customNodesPromise = loadCustomNodes();

	const tutorialsItem = localStorageItem('tutorials', {} as Projects);
	const tutorials = $derived(tutorialsItem.value);
	let chosenTutorial = $derived(tutorials[id]);

	$effect(() => {
		if (!chosenTutorial) {
			tutorials[id] = createTutorialProject(chosenProjectName, route.tutorialId);
		}
	});

	const handleChange = (audioCanvas: SerializedAudioElements) => {
		if (!chosenTutorial) return;

		tutorials[id] = {
			...chosenTutorial,
			lastChanged: new Date(Date.now()).toISOString(),
			audioCanvas
		};
	};

	const handleSizeChange = (size: number) => {
		if (!chosenTutorial) return;

		tutorials[id] = {
			...chosenTutorial,
			size
		};
	};

	const handleCanvasRelativePositionChange = (canvasRelativePosition: Position) => {
		if (!chosenTutorial) return;

		tutorials[id] = {
			...chosenTutorial,
			canvasRelativePosition
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
