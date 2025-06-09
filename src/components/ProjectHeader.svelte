<script lang="ts">
	import Play from '../icons/Play.svg?component';
	import Pause from '../icons/Pause.svg?component';
	import ChevronRight from '../icons/Chevron_Right.svg?component';
	import AddPlus from '../icons/Add_Plus.svg?component';
	import RemoveMinus from '../icons/Remove_Minus.svg?component';

	interface Props {
		projectName: string;
		playing: boolean;
		onPlayChange?(event: { playing: boolean }): void;
		onProjectNameClick?(): void;
		onMakeStuffSmaller?(): void;
		onMakeStuffBigger?(): void;
	}

	let { projectName, playing, onMakeStuffBigger, onMakeStuffSmaller, onPlayChange, onProjectNameClick }: Props = $props();

	const handlePlayOrPauseClick = () => {
		onPlayChange?.({ playing: !playing })
	};
</script>

<div class="menu">
	<a class="header" href="/">
		audio<span class="suffix">canvas.io</span>
	</a>
	<div class="projectMenu" ontouchstart={(e) => e.stopPropagation()}>
		<button class="projectName" onclick={onProjectNameClick} onkeypress={() => {}}>
			<ChevronRight />
			<div>{projectName}</div>
		</button>
		<button class="playPause" onclick={handlePlayOrPauseClick} onkeypress={() => {}}>
			{#if playing}
				<Pause />
			{:else}
				<Play />
			{/if}
		</button>
		<div class="resize">
			<button class="minus" onclick={onMakeStuffSmaller} onkeypress={() => {}}>
				<RemoveMinus />
			</button>
			<button class="plus" onclick={onMakeStuffBigger} onkeypress={() => {}}><AddPlus /></button
			>
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
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}

	.playPause {
		display: flex;
		align-items: center;
		cursor: pointer;
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}

	.resize {
		display: flex;
		gap: 16px;
		align-items: center;
	}

	.minus,
	.plus {
		cursor: pointer;
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
</style>
