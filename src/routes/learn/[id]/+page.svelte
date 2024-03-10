<script lang="ts">
	import type { Position, SerializedAudioElements } from '../../../audio/serialized';
	import { loadCustomNodes } from '../../../audio/web-audio/utils';
	import AudioCanvas from '../../../components/AudioCanvas.svelte';
	import { createTutorialProject, type Projects } from '../../../ui/project';
    import { tutorial1 } from "../../../components/Tutorial";
    import type { Tutorial } from "../../../components/Tutorial/types";

    export let data;

    $: id = data.id;

    const routes: Record<string, { title: string, tutorial: Tutorial }> = {
        'basics': {
            title: 'Basics',
            tutorial: tutorial1
        }
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
                [id]: createTutorialProject(id)
            }

            chosenTutorial = tutorials[id];
        }
    }

    $: console.log(chosenTutorial);

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
