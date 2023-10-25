<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { categorizedNodeTypes } from '../audio/serialized';
	import Button from './Button.svelte';
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
				<div class="submenu" class:visible={hoveredOverNodeType === nodeType}>
					<Menu>
						{#each nodeTypes as innerNodeType (innerNodeType)}
							<Button
								on:click={handleNodeClick(innerNodeType)}
								title={innerNodeType.replaceAll('-', ' ')}
							/>
						{/each}
					</Menu>
				</div>
			</div>
		{/each}
	</div>
	<Button title="Paste" on:click={handlePasteClick} />
</Menu>

<style>
	.menu-section {
		padding: 4px 8px;
		position: relative;
		font-size: 14px;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.menu-section:hover {
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
	}
</style>
