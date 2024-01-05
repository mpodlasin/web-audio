<script lang="ts">
	import Play from '../icons/Play.svg?component';
	import Pause from '../icons/Pause.svg?component';
	import Expand from '../icons/Expand.svg?component';
	import Shrink from '../icons/Shrink.svg?component';
	import ChevronRight from '../icons/Chevron_Right.svg?component';
	import { createEventDispatcher } from 'svelte';

	export let projectName: string;

	export let embedded: boolean;
	export let fullScreen: boolean;
	export let playing: boolean;

	const dispatcher = createEventDispatcher();

	const handlePlayOrPauseClick = () => {
		dispatcher('playChange', {
			playing: !playing
		});
	};

	const handleProjectNameClick = () => {
		dispatcher('projectNameClick');
	};

	const handleFullscreenClick = () => {
		dispatcher('fullscreen');
	};
</script>

<div class="menu" class:embedded>
	{#if !embedded}
		<div class="projectName" on:click={handleProjectNameClick} on:keypress={() => {}}>
			<ChevronRight />
			<div>{projectName}</div>
		</div>
	{/if}
	<div class="playPause" on:click={handlePlayOrPauseClick} on:keypress={() => {}}>
		{#if playing}
			<Pause />
		{:else}
			<Play />
		{/if}
	</div>
	{#if embedded}
		<div class="fullscreen" on:click={handleFullscreenClick} on:keypress={() => {}}>
			{#if fullScreen}
				<Shrink />
			{:else}
				<Expand />
			{/if}
		</div>
	{/if}
</div>

<style>
	.menu {
		position: fixed;
		top: 8px;
		left: 8px;
		border: 1px solid var(--neutral-500);
		background-color: var(--neutral-900);
		border-radius: 8px;
		padding: 16px;

		display: flex;
		gap: 32px;
		align-items: center;
	}

	.embedded {
		position: absolute;
		padding: 16px 24px;
	}

	.projectName {
		display: flex;
		gap: 4px;
		align-items: center;
		cursor: pointer;
	}

	.playPause,
	.fullscreen {
		display: flex;
		align-items: center;
		cursor: pointer;
	}
</style>
