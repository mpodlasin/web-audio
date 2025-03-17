<script lang="ts">
	import { onMount } from "svelte";

    export let id: string;

    let tutorialStepsString = '{}';
    $: tutorialSteps = JSON.parse(tutorialStepsString);
    $: steps = tutorialSteps[id] ?? 0;

    let tutorialLength = 0;

    $: green = tutorialLength === steps + 1;

    $: displayedSteps = steps === 0 ? 0 : steps + 1;

    onMount(async () => {
        tutorialStepsString = window.localStorage.getItem('tutorial_steps') ?? '{}';

        const { tutorials } = await import('../../../components/Tutorial');

        tutorialLength = tutorials[id]?.steps.length ?? 0;
    })
</script>
{#if tutorialLength === 0}
    <slot />
{:else}
    <div>
        <slot />
        <span class:green>({displayedSteps} / {tutorialLength})</span>
    </div>
{/if}

<style>
    span {
        font-size: 0.85em;
        color: var(--neutral-500);
    }

    .green {
        color: var(--success-500);
    }
</style>