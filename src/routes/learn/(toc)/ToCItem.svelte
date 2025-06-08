<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		id: string;
		children?: import('svelte').Snippet;
	}

	let { id, children }: Props = $props();

	let tutorialStepsString = $state('{}');
	let tutorialSteps = $derived(JSON.parse(tutorialStepsString));
	let steps = $derived(tutorialSteps[id] ?? 0);

	let tutorialLength = $state(0);

	let green = $derived(tutorialLength === steps + 1);

	let displayedSteps = $derived(steps === 0 ? 0 : steps + 1);

	onMount(async () => {
		tutorialStepsString = window.localStorage.getItem('tutorial_steps') ?? '{}';

		const { tutorials } = await import('../../../components/Tutorial');

		tutorialLength = tutorials[id]?.steps.length ?? 0;
	});
</script>

{#if tutorialLength === 0}
	{@render children?.()}
{:else}
	<div>
		{@render children?.()}
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
