<script lang="ts">
	import type { Position, SerializedAudioElements } from '../../../audio/serialized';
	import { loadCustomNodes } from '../../../audio/web-audio/utils';
	import AudioCanvas from '../../../components/AudioCanvas.svelte';
	import { createTutorialProject, type Projects } from '../../../ui/project';

    export let data;

    $: id = data.id;

    const routes: Record<string, { title: string, tutorialId: string }> = {
        'basics': {
            title: 'Basics',
			tutorialId: 'tutorial1',
		},
    }

    $: route = routes[id];

	const customNodesPromise = loadCustomNodes();

	const localStorageKey = 'tutorials';

	const tutorialsString = localStorage.getItem(localStorageKey);

	let tutorials: Projects =
		tutorialsString !== null
			? JSON.parse(tutorialsString)
			: {};


    $: chosenProjectName = route?.title ?? '';
    let chosenTutorial = tutorials[id];

    $: {
        if (!chosenTutorial && route) {
            tutorials = {
                ...tutorials,
                [id]: createTutorialProject(chosenProjectName, route.tutorialId),
            }

            chosenTutorial = tutorials[id];
        }
    }

	$: {
		localStorage.setItem(localStorageKey, JSON.stringify(tutorials));
	}

	const handleChange = (event: CustomEvent<SerializedAudioElements>) => {};

	const handleSizeChange = (event: CustomEvent<number>) => {};

	const handleCanvasRelativePositionChange = (event: CustomEvent<Position>) => {};
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
				on:change={handleChange}
				on:sizeChange={handleSizeChange}
				on:canvasRelativePositionChange={handleCanvasRelativePositionChange}
			/>
		{/key}
	{/if}
{/await}
