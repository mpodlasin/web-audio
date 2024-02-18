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

	$: descriptionId = node.descriptionId;

	$: tutorial = tutorials[descriptionId] ?? tutorial1;

	let currentStep = 0;

	$: Copy = tutorial?.steps[currentStep]?.copy;
	$: check = tutorial?.steps[currentStep]?.check ?? (() => false);

	$: checkResult = check(audioGraph);

	const handleContinueClick = () => {
		currentStep += 1;
	};
</script>

<div>
	{#if Copy}
		<Copy />
	{/if}
	<div class="result">
		{#if checkResult}
			<div>
				<p>Great! You've completed this tutorial.</p>
				<Button on:click={handleContinueClick} title="Continue..." />
			</div>
		{:else}
			<p>Keep going!</p>
		{/if}
	</div>
</div>

<style>
	div {
		font-size: 0.8em;
		max-width: 400px;
	}

	.result {
		margin-top: 1em;
		color: var(--primary-500);
		font-size: 1.2em;
	}
</style>
