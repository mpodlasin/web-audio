<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import {
		categorizedNodeTypes,
		readableCategoryNames,
		readableNames as _readableNames,
		type Position
	} from '../audio/serialized';
	import ChevronRight from '../icons/Chevron_Right.svg?component';
	import Menu from './Menu.svelte';
	import MenuButton from './MenuButton.svelte';
	import PositionedMenu from './PositionedMenu.svelte';

	export let position: Position;

	const menuHeight = 363;
	const menuWidth = 160;

	let displaySubmenusOnTheLeft = false;
	let displayedPosition: Position;

	$: {
		const y = position.y;
		const x = position.x;

		if (y + menuHeight > window.innerHeight) {
			displayedPosition = {
				y: window.innerHeight - menuHeight,
				x: position.x
			};
		} else {
			displayedPosition = position;
		}

		if (x + menuWidth > window.innerWidth) {
			displaySubmenusOnTheLeft = true;
		}
	}

	const readableNames = _readableNames as Record<string, string>;

	const dispatcher = createEventDispatcher();

	let hoveredOverNodeType = '';
	let setTimeoutId: NodeJS.Timeout | null = null;

	const handleMouseEnter = (nodeType: string) => () => {
		if (setTimeoutId) {
			clearTimeout(setTimeoutId);
		}

		hoveredOverNodeType = nodeType;
	};

	const handleMouseLeave = () => {
		const id = setTimeout(() => {
			hoveredOverNodeType = '';
			setTimeoutId = null;
		}, 700);

		setTimeoutId = id;
	};

	const handleNodeClick = (nodeType: string) => () => {
		dispatcher('create', nodeType);
	};

	const handlePasteClick = () => {
		dispatcher('paste');
	};

	const categorizedNodeTypesToDisplay = {
		...categorizedNodeTypes,
		internal: []
	};
</script>

<PositionedMenu position={displayedPosition} on:close>
	<div class="create-section">
		{#each Object.entries(categorizedNodeTypesToDisplay) as [nodeType, nodeTypes] (nodeType)}
			{#if nodeTypes.length > 0}
				<MenuButton>
					<div
						class="menu-section"
						on:mouseenter={handleMouseEnter(nodeType)}
						on:touchstart={handleMouseEnter(nodeType)}
						on:mouseleave={handleMouseLeave}
					>
						<div>{readableCategoryNames[nodeType]}</div>
						<div class="icon"><ChevronRight /></div>
						<div
							class="submenu"
							class:left={displaySubmenusOnTheLeft}
							class:visible={hoveredOverNodeType === nodeType}
						>
							<Menu>
								{#each nodeTypes as innerNodeType (innerNodeType)}
									<MenuButton
										on:click={handleNodeClick(innerNodeType)}
										on:touchstart={handleNodeClick(innerNodeType)}
										on:keydown={() => {}}
									>
										{readableNames[innerNodeType]}
									</MenuButton>
								{/each}
							</Menu>
						</div>
					</div>
				</MenuButton>
			{/if}
		{/each}
	</div>
	<MenuButton on:click={handlePasteClick} on:touchstart={handlePasteClick} on:keypress={() => {}}
		>Paste</MenuButton
	>
</PositionedMenu>

<style>
	.menu-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
	}

	.submenu {
		position: absolute;
		left: 100%;
		top: 0;
		opacity: 0;
		transition: opacity 0.2s;
		pointer-events: none;
		z-index: 101;
	}

	.submenu.left {
		left: auto;
		right: 100%;
	}

	.submenu.visible {
		opacity: 1;
		pointer-events: all;
	}

	.create-section {
		border-bottom: 1px solid var(--neutral-500);
		padding-bottom: 8px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.icon {
		display: flex;
		align-items: center;
	}

	.icon :global(svg path) {
		stroke: var(--neutral-500);
	}
</style>
