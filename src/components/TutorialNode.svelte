<script lang="ts">
	import type { SerializedAudioElements, SerializedTutorialNode } from '../audio/serialized';
	import type { Tutorial } from './Tutorial/types';
	import { tutorial1 } from './Tutorial/Tutorial1/index';
	import Button from './Button.svelte';

	export let audioGraph: SerializedAudioElements;
	export let node: SerializedTutorialNode;

	const tutorials: Record<string, Tutorial> = {
		tutorial1: tutorial1
	};

	$: tutorialId = node.tutorialId;

	$: tutorial = tutorials[tutorialId];

	let currentStep = 0;

	$: Copy = tutorial?.steps[currentStep]?.copy;
	$: check = tutorial?.steps[currentStep]?.check ?? true;

	$: numberOfSteps = tutorial?.steps.length ?? 0;

	$: noCheckNeeded = check === true;
	$: checkResult = check === true || check(audioGraph);

	const handleContinueClick = () => {
		currentStep = currentStep + 1;
	};
</script>

<div>
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
		{:else}
			<p>Perform the action described above to continue.</p>
		{/if}
	</div>
</div>

<style>
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
