<script lang="ts">
	import type { SerializedAudioElements, SerializedTutorialNode } from '../audio/serialized';
	import type { Tutorial } from './Tutorial/types';
	import { tutorial1 } from './Tutorial/Tutorial1/index';
	import Button from './Button.svelte';

	export let audioGraph: SerializedAudioElements;
	export let node: SerializedTutorialNode;

	const localStorageKey = 'tutorial_steps';

	const tutorials: Record<string, Tutorial> = {
		tutorial1: tutorial1
	};

	$: tutorialId = node.tutorialId;

	let currentStep = 0;

	$: {
		const tutorialSteps = JSON.parse(window.localStorage.getItem(localStorageKey) ?? '{}');
		currentStep = tutorialSteps[tutorialId] ?? 0;
	}

	$: tutorial = tutorials[tutorialId];

	$: Copy = tutorial?.steps[currentStep]?.copy;
	$: check = tutorial?.steps[currentStep]?.check ?? true;

	$: numberOfSteps = tutorial?.steps.length ?? 0;

	$: noCheckNeeded = typeof check === 'boolean';
	$: checkResult = typeof check === 'boolean' ? check : check(audioGraph);

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
			<svelte:component this={Copy} />
		{/if}
	</div>
	<div class="result">
		{#if checkResult}
			<div>
				{#if !noCheckNeeded}
					<p>Great! You've completed this step of the tutorial.</p>
				{/if}
				<Button variant="primary" on:click={handleContinueClick} title="Next" />
			</div>
		{:else if check === true}
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

	.steps {
		font-size: 0.9em;
		color: var(--primary-500);
	}

	.result {
		margin-top: 1em;
		color: var(--primary-500);
		font-size: 0.9em;
	}
</style>
