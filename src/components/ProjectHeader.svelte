<script lang="ts">
	import Play from '../icons/Play.svg?component';
	import Pause from '../icons/Pause.svg?component';
	import ChevronRight from '../icons/Chevron_Right.svg?component';
	import AddPlus from '../icons/Add_Plus.svg?component';
	import RemoveMinus from '../icons/Remove_Minus.svg?component';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		projectName: string;
		playing: boolean;
	}

	let { projectName, playing }: Props = $props();

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

<div class="menu">
	<a class="header" href="/">
		audio<span class="suffix">canvas.io</span>
	</a>
	<div class="projectMenu" ontouchstart={(e) => e.stopPropagation()}>
		<div class="projectName" onclick={handleProjectNameClick} onkeypress={() => {}}>
			<ChevronRight />
			<div>{projectName}</div>
		</div>
		<div class="playPause" onclick={handlePlayOrPauseClick} onkeypress={() => {}}>
			{#if playing}
				<Pause />
			{:else}
				<Play />
			{/if}
		</div>
		<div class="resize">
			<div class="minus" onclick={handleMakeStuffSmaller} onkeypress={() => {}}>
				<RemoveMinus />
			</div>
			<div class="plus" onclick={handleMakeStuffBigger} onkeypress={() => {}}><AddPlus /></div>
		</div>
	</div>
</div>

<style>
	.menu {
		position: fixed;
		top: 8px;
		left: 8px;

		display: flex;
		justify-content: center;
		align-items: stretch;
		gap: 8px;

		z-index: 100;
	}

	.header {
		border: 1px solid var(--neutral-500);
		background-color: var(--neutral-900);
		border-radius: 8px;
		padding: 12px;
		color: var(--neutral-300);
		display: none;
		font-family: var(--primary-font);
		font-size: 20px;
	}

	@media (min-width: 500px) {
		.header {
			display: block;
		}
	}

	.suffix {
		color: var(--primary-500);
	}

	.projectMenu {
		border: 1px solid var(--neutral-500);
		background-color: var(--neutral-900);
		border-radius: 8px;
		padding: 16px;

		display: flex;
		gap: 32px;
		align-items: center;
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

	.minus,
	.plus {
		cursor: pointer;
	}
</style>
