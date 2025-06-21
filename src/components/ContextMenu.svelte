<script lang="ts">
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

	interface Props {
		position: Position;
		onCreate(nodeType: string): void;
		onPaste(): void;
		onClose(): void;
	}

	let { position, onPaste, onCreate, onClose }: Props = $props();

	const menuHeight = 363;
	const menuWidth = 160;

	let displaySubmenusOnTheLeft = $state(false);
	let displayedPosition: Position | undefined = $state();

	$effect(() => {
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
	});

	const readableNames = _readableNames as Record<string, string>;

	let hoveredOverNodeType = $state('');
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
		onCreate(nodeType);
	};

	const handlePasteClick = () => {
		onPaste();
	};

	const categorizedNodeTypesToDisplay = {
		...categorizedNodeTypes,
		internal: []
	};
</script>

<PositionedMenu position={displayedPosition || { x: 0, y: 0 }} {onClose}>
	<div class="create-section">
		{#each Object.entries(categorizedNodeTypesToDisplay) as [nodeType, nodeTypes] (nodeType)}
			{#if nodeTypes.length > 0}
				<MenuButton>
					<div
						class="menu-section"
						onmouseenter={handleMouseEnter(nodeType)}
						ontouchstart={handleMouseEnter(nodeType)}
						role="menu"
						tabindex={0}
						onmouseleave={handleMouseLeave}
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
										onClick={handleNodeClick(innerNodeType)}
										onTouchStart={handleNodeClick(innerNodeType)}
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
	<MenuButton onClick={handlePasteClick} onTouchStart={handlePasteClick}>Paste</MenuButton>
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
		z-index: 100;
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
