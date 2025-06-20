<script lang="ts">
	import type { SerializedAudioElements, SerializedTutorialNode } from '../audio/serialized';
	import { tutorials } from './Tutorial';
	import Button from './Button.svelte';
	import { globalContext } from '../audio/GlobalContext';

	interface Props {
		audioGraph: SerializedAudioElements;
		node: SerializedTutorialNode;
	}

	let { audioGraph, node }: Props = $props();

	const localStorageKey = 'tutorial_steps';

	let tutorialId = $derived(node.tutorialId);

	let currentStep = $state(0);

	$effect(() => {
		const tutorialSteps = JSON.parse(window.localStorage.getItem(localStorageKey) ?? '{}');
		currentStep = tutorialSteps[tutorialId] ?? 0;
	});

	let tutorial = $derived(tutorials[tutorialId]);

	let Copy = $derived(tutorial?.steps[currentStep]?.copy);
	let check = $derived(tutorial?.steps[currentStep]?.check ?? true);

	let numberOfSteps = $derived(tutorial?.steps.length ?? 0);

	let noCheckNeeded = $derived(typeof check === 'boolean');
	let checkResult = $derived(typeof check === 'boolean' ? check : check(audioGraph));

	globalContext.addEventListener('statechange', () => {
		checkResult = typeof check === 'boolean' ? check : check(audioGraph);
	});

	const handleContinueClick = () => {
		currentStep = currentStep + 1;
		const tutorialSteps = JSON.parse(window.localStorage.getItem(localStorageKey) ?? '{}');
		tutorialSteps[tutorialId] = currentStep;
		window.localStorage.setItem(localStorageKey, JSON.stringify(tutorialSteps));
	};
</script>

<div class="wrapper">
	<div class="steps">
		{currentStep + 1} / {numberOfSteps}
	</div>
	<div class="copy">
		{#if Copy}
			{@render Copy()}
		{/if}
	</div>
	<div class="result">
		{#if checkResult}
			<div>
				{#if !noCheckNeeded}
					<p class="success">Great! You've completed this step of the tutorial.</p>
				{/if}
				<Button variant="primary" onClick={handleContinueClick} title="Next" />
			</div>
		{:else if typeof check === 'function'}
			<p>Perform the action described above to continue.</p>
		{/if}
	</div>
</div>

<style>
	.wrapper {
		padding: 0 8px;
	}
	.copy {
		font-size: 0.85em;
		width: 400px;
	}

	.copy :global(code) {
		color: var(--primary-500);
	}

	.copy :global(th),
	.copy :global(td) {
		border: 0.5px solid var(--neutral-500);
		padding: 4px;
	}

	.steps {
		font-size: 0.9em;
		color: var(--primary-500);
		padding-bottom: 8px;
	}

	.result {
		margin-top: 1em;
		color: var(--primary-500);
		font-size: 0.9em;
	}

	.success {
		color: #6bbd6b;
	}
</style>
