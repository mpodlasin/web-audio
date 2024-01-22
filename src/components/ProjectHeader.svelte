<script lang="ts">
	import Play from '../icons/Play.svg?component';
	import Pause from '../icons/Pause.svg?component';
	import ChevronRight from '../icons/Chevron_Right.svg?component';
	import AddPlus from '../icons/Add_Plus.svg?component';
	import RemoveMinus from '../icons/Remove_Minus.svg?component';
	import { createEventDispatcher } from 'svelte';

	export let projectName: string;
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

	const handleMakeStuffSmaller = () => {
		dispatcher('makeStuffSmaller');
	};

	const handleMakeStuffBigger = () => {
		dispatcher('makeStuffBigger');
	};
</script>

<div class="menu" on:touchstart={(e) => e.stopPropagation()}>
	<div class="projectName" on:click={handleProjectNameClick} on:keypress={() => {}}>
		<ChevronRight />
		<div>{projectName}</div>
	</div>
	<div class="playPause" on:click={handlePlayOrPauseClick} on:keypress={() => {}}>
		{#if playing}
			<Pause />
		{:else}
			<Play />
		{/if}
	</div>
	<div class="resize">
		<div class="minus" on:click={handleMakeStuffSmaller} on:keypress={() => {}}><RemoveMinus /></div>
		<div class="plus" on:click={handleMakeStuffBigger} on:keypress={() => {}}><AddPlus /></div>
	</div>
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

		z-index: 100;
	}

	.projectName {
		display: flex;
		gap: 4px;
		align-items: center;
		cursor: pointer;
	}

	.playPause {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.resize {
		display: flex;
		gap: 16px;
		align-items: center;
	}

	.minus, .plus {
		cursor: pointer;
	}
</style>
