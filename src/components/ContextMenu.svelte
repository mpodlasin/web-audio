<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { categorizedNodeTypes } from '../audio/serialized';
	import ChevronRight from '../icons/Chevron_Right.svg?component';
	import Menu from './Menu.svelte';

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

	const handleNodeClick = (nodeType: string) => (event: MouseEvent) => {
		dispatcher('create', nodeType);
	};

	const handlePasteClick = () => {
		dispatcher('paste');
	};
</script>

<Menu>
	<div class="create-section">
		{#each Object.entries(categorizedNodeTypes) as [nodeType, nodeTypes] (nodeType)}
			<div
				class="menu-section"
				on:mouseenter={handleMouseEnter(nodeType)}
				on:mouseleave={handleMouseLeave}
			>
				<div>{nodeType}</div>
				<div class="icon"><ChevronRight /></div>
				<div class="submenu" class:visible={hoveredOverNodeType === nodeType}>
					<Menu>
						{#each nodeTypes as innerNodeType (innerNodeType)}
							<div
								class="menu-button"
								on:click={handleNodeClick(innerNodeType)}
								on:keydown={() => {}}
							>
								{innerNodeType.replaceAll('-', ' ')}
							</div>
						{/each}
					</Menu>
				</div>
			</div>
		{/each}
	</div>
	<div class="menu-button" on:click={handlePasteClick} on:keypress={() => {}}>paste</div>
</Menu>

<style>
	.menu-section,
	.menu-button {
		padding: 4px 8px;
		position: relative;
		font-size: 14px;
		border-radius: 4px;
		transition: background-color 0.2s;
		cursor: pointer;
		white-space: nowrap;
	}

	.menu-section {
		padding-right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
	}

	.menu-section:hover,
	.menu-button:hover {
		background-color: var(--neutral-700);
	}

	.submenu {
		position: absolute;
		left: 100%;
		top: 0;
		opacity: 0;
		transition: opacity 0.2s;
		pointer-events: none;
	}

	.submenu.visible {
		opacity: 1;
		pointer-events: all;
	}

	.create-section {
		border-bottom: 1px solid var(--neutral-500);
		padding-bottom: 8px;
	}

	.icon {
		display: flex;
		align-items: center;
	}

	.icon :global(svg path) {
		stroke: var(--neutral-500);
	}
</style>
