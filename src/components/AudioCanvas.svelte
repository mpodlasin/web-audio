<script lang="ts">
	import {
		type AudioNodeDatabase,
		playAudioCanvas,
		type SerializedAudioElements,
		allowedSerializedAudioElementStaticDefinitions,
		updateAudioCanvas,
		addNode,
		addConnection,
		changeParameter,
		type Plug,
		removeConnection,
		removeNode,
		addConnectionToParameter,
		type Position,
		type SerializedAudioElement,
		type AllowedSerializedAudioElements,
		insertExistingNodes
	} from '../audio/AudioCanvas';
	import DraggableNode from '../components/DraggableNode.svelte';
	import Menu from './Menu.svelte';
	import Button from './Button.svelte';
	import ProjectHeader from './ProjectHeader.svelte';
	import { getLinesToDisplay } from '../ui/lines';
	import { addDiffToAllPositions, type PlugPositions } from '../ui/plugPositions';
	import ProjectsModal from './ProjectsModal.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Project } from '../ui/project';
	import Line from './Line.svelte';
	import ContextMenu from './ContextMenu.svelte';
	import { dragNode } from '../ui/dragNode';
	import MenuButton from './MenuButton.svelte';
	import { globalContext } from '../audio/GlobalContext';

	export let chosenProjectName: string;
	export let projectNames: string[];
	export let project: Project;

	let initialAudioCanvas = project.audioCanvas;

	let audioNodeDatabase: AudioNodeDatabase = {};

	let audioGraphHistory: SerializedAudioElements[] = [{}, initialAudioCanvas];
	let dragPosition: Position | null = null;

	let selectNodesStartPosition: Position | null = null;
	let selectNodesEndPosition: Position | null = null;

	const handleCanvasDoubleClick = (event: MouseEvent) => {
		if (event.detail === 2) {
			selectedNodeIds = [];
		}
	};

	const isAlternativeKey = (event: MouseEvent) => event.altKey || event.metaKey;

	const handleNodeClick = (id: string) => (event: MouseEvent) => {
		event.preventDefault();
		if (isAlternativeKey(event)) {
			if (event.shiftKey) {
				if (selectedNodeIds.some((selectedId) => selectedId === id)) {
					selectedNodeIds = selectedNodeIds.filter((selectedId) => selectedId !== id);
				} else {
					selectedNodeIds = [...selectedNodeIds, id];
				}
			} else {
				selectedNodeIds = [id];
			}
		}
	};

	const handleDragCanvasStart = (event: MouseEvent) => {
		event.preventDefault();
		if (isAlternativeKey(event)) {
			if (!event.shiftKey) {
				selectedNodeIds = [];
			}
			selectNodesStartPosition = {
				x: event.clientX,
				y: event.clientY
			};
		} else {
			dragPosition = {
				x: event.clientX,
				y: event.clientY
			};
		}
	};

	const handleDragCanvasEnd = () => {
		dragPosition = null;
		selectNodesStartPosition = null;
		selectNodesEndPosition = null;
	};

	const handleSelectNodesDrag = (event: MouseEvent) => {
		selectNodesEndPosition = {
			x: event.clientX,
			y: event.clientY
		};
	};

	const handleDragCanvas = (event: MouseEvent) => {
		if (selectNodesStartPosition) {
			handleSelectNodesDrag(event);
			return;
		}

		if (!dragPosition) return;

		const positionChange = {
			x: dragPosition.x - event.clientX,
			y: dragPosition.y - event.clientY
		};

		const newAudioGraphWithPositions = Object.fromEntries(
			Object.entries(audioGraphWithPositions).map(([id, node]) => [
				id,
				{
					...node,
					ui: {
						...node.ui,
						position: node.ui?.position
							? {
									x: node.ui.position.x - positionChange.x,
									y: node.ui.position.y - positionChange.y
							  }
							: { x: 0, y: 0 }
					}
				}
			])
		);

		audioGraphHistory = [...audioGraphHistory, newAudioGraphWithPositions];

		plugPositions = addDiffToAllPositions(plugPositions, -positionChange.x, -positionChange.y);

		dragPosition = {
			x: event.clientX,
			y: event.clientY
		};
	};

	$: previousAudioGraphWithPositions = audioGraphHistory.at(-2) ?? {};
	$: audioGraphWithPositions = audioGraphHistory.at(-1) ?? {};

	const dispatcher = createEventDispatcher();

	$: {
		dispatcher('change', audioGraphWithPositions);
	}

	let selectedNodeIds: string[] = [];

	$: {
		if (selectNodesStartPosition && selectNodesEndPosition) {
			const filteredIds = Object.entries(audioGraphWithPositions)
				.filter(([_, node]) => {
					const x = node.ui?.position.x ?? 0;
					const y = node.ui?.position.y ?? 0;

					if (!selectNodesEndPosition) {
						return false;
					}

					if (!selectNodesStartPosition) {
						return false;
					}

					return (
						x < selectNodesEndPosition.x &&
						y < selectNodesEndPosition?.y &&
						selectNodesStartPosition?.x < x &&
						selectNodesStartPosition?.y < y
					);
				})
				.map(([id]) => id)
				.filter((id) => !selectedNodeIds.some((selectedId) => selectedId === id));

			selectedNodeIds = [...selectedNodeIds, ...filteredIds];
		}
	}

	let plugPositions: PlugPositions = {};

	const handleDragNode = (event: CustomEvent<{ x: number; y: number; id: string }>) => {
		if (selectedNodeIds.some((selectedId) => selectedId === event.detail.id)) {
			const draggedNode = audioGraphWithPositions[event.detail.id];

			if (!draggedNode) return;

			const diffX = (draggedNode.ui?.position.x ?? 0) - event.detail.x;
			const diffY = (draggedNode.ui?.position.y ?? 0) - event.detail.y;

			audioGraphHistory = selectedNodeIds.reduce((audioGraphHistory, id) => {
				const node = audioGraphHistory.at(-1)?.[id];

				if (!node) return audioGraphHistory;

				return dragNode(
					{
						id,
						x: (node.ui?.position.x ?? 0) - diffX,
						y: (node.ui?.position.y ?? 0) - diffY
					},
					audioGraphHistory,
					plugPositions
				);
			}, audioGraphHistory);
		} else {
			audioGraphHistory = dragNode(event.detail, audioGraphHistory, plugPositions);
		}
	};

	const handleNodePlugPositions = (event: CustomEvent) => {
		const { id, inputPlugPositions, outputPlugPositions, parameterKnobPositions } = event.detail;

		plugPositions[id] = {
			inputPlugPositions,
			outputPlugPositions,
			parameterKnobPositions
		};
	};

	$: linesToDisplay = getLinesToDisplay(audioGraphWithPositions, plugPositions);

	const handleNodeParameterChange = (
		event: CustomEvent<{ id: string; parameterName: string; value: number }>
	) => {
		const { id, parameterName, value } = event.detail;

		audioGraphHistory = [
			...audioGraphHistory,
			changeParameter(audioGraphWithPositions, id, parameterName, value)
		];
	};

	$: {
		updateAudioCanvas(audioGraphWithPositions, previousAudioGraphWithPositions, audioNodeDatabase);
	}

	const handleCreateElementClick = (
		event: CustomEvent<keyof typeof allowedSerializedAudioElementStaticDefinitions>
	) => {
		event.preventDefault();

		audioGraphHistory = [
			...audioGraphHistory,
			addNode(audioGraphWithPositions, event.detail, menuPosition)
		];
	};

	/* -------------------------------------------------------------------------- */
	/* LINE DRAGGING */

	let draggingLine = false;
	let startingPlug: { id: string; type: 'input' | 'output'; nodeId: string } | null = null;
	let positionOfStartingPlug: { x: number; y: number } = { x: 0, y: 0 };
	let positionOfEndPlug: { x: number; y: number } = { x: 0, y: 0 };

	const handlePlugClick = (
		event: CustomEvent<{ id: string; type: 'input' | 'output'; nodeId: string }>
	) => {
		const { id, type, nodeId } = event.detail;

		draggingLine = true;
		startingPlug = { id, type, nodeId };
		positionOfStartingPlug =
			plugPositions[nodeId]?.[type === 'input' ? 'inputPlugPositions' : 'outputPlugPositions'][id]!;

		window.addEventListener('mouseup', stopDragging, { once: true });
	};

	const stopDragging = () => {
		draggingLine = false;
	};

	const handlePlugUp = (
		event: CustomEvent<{ id: string; type: 'input' | 'output'; nodeId: string }>
	) => {
		if (!draggingLine) return;
		if (!startingPlug) return;

		audioGraphHistory = [
			...audioGraphHistory,
			addConnection(audioGraphWithPositions, startingPlug, event.detail)
		];

		stopDragging();
	};

	const handleKnobMouseUp = (event: CustomEvent<{ nodeId: string; parameterName: string }>) => {
		if (!draggingLine) return;
		if (!startingPlug) return;

		audioGraphHistory = [
			...audioGraphHistory,
			addConnectionToParameter(audioGraphWithPositions, startingPlug, {
				nodeId: event.detail.nodeId,
				type: 'input',
				id: event.detail.parameterName
			})
		];

		stopDragging();
	};

	const handleLineDrag = (event: MouseEvent) => {
		event.preventDefault();

		positionOfEndPlug = { x: event.clientX, y: event.clientY };
	};

	/* ----------------------------------------------------------- */

	const handleDeleteConnection = () => {
		if (!lineMenuPlugs) return;

		audioGraphHistory = [
			...audioGraphHistory,
			removeConnection(audioGraphWithPositions, lineMenuPlugs[0], lineMenuPlugs[1])
		];

		showMenu = false;
	};

	let copiedNodes: string[] = [];

	const handleCopyNode = () => {
		if (selectedNodeIds.some((id) => id === menuNodeId)) {
			copiedNodes = selectedNodeIds;
		} else {
			copiedNodes = [menuNodeId];
		}
	};

	const handlePasteClick = () => {
		const newAudioGraph = insertExistingNodes(audioGraphWithPositions, copiedNodes, menuPosition);
		audioGraphHistory = [...audioGraphHistory, newAudioGraph];
	};

	const handleDeleteNode = () => {
		if (selectedNodeIds.some((selectedId) => selectedId === menuNodeId)) {
			const newAudioGraph = selectedNodeIds.reduce(removeNode, audioGraphWithPositions);

			audioGraphHistory = [...audioGraphHistory, newAudioGraph];
		} else {
			audioGraphHistory = [...audioGraphHistory, removeNode(audioGraphWithPositions, menuNodeId)];
		}
	};

	let playing = false;
	let calledPlayAudioCanvas = false;

	const handlePlayChange = (event: CustomEvent<{ playing: boolean }>) => {
		playing = event.detail.playing;
	};

	$: {
		if (playing) {
			globalContext.resume();
			if (!calledPlayAudioCanvas) {
				playAudioCanvas(audioNodeDatabase);
				calledPlayAudioCanvas = true;
			}
		} else {
			globalContext.suspend();
		}
	}

	/* ---------------------------------------------- */
	/* CONTEXT MENU */

	let menuPosition = { x: 0, y: 0 };
	let showMenu = false;
	let menuKind: 'canvas' | 'node' | 'line' = 'canvas';
	let lineMenuPlugs: [Plug, Plug] | null = null;
	let menuNodeId: string = '';

	const handleCanvasLeftClick = (event: MouseEvent) => {
		event.preventDefault();

		menuPosition = { x: event.clientX, y: event.clientY };
		showMenu = true;
		menuKind = 'canvas';
		lineMenuPlugs = null;

		window.addEventListener('click', closeMenu, { once: true });
	};

	const handleLineLeftClick = (fromPlug: Plug, toPlug: Plug) => (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();

		showMenu = true;
		menuKind = 'line';
		lineMenuPlugs = [fromPlug, toPlug];
		menuPosition = { x: event.clientX, y: event.clientY };

		window.addEventListener('click', closeMenu, { once: true });
	};

	const handleNodeLeftClick = (nodeId: string) => (event: MouseEvent) => {
		event.preventDefault();

		menuPosition = { x: event.clientX, y: event.clientY };
		showMenu = true;
		menuKind = 'node';
		lineMenuPlugs = null;
		menuNodeId = nodeId;

		window.addEventListener('click', closeMenu, { once: true });
	};

	const closeMenu = () => {
		showMenu = false;
		lineMenuPlugs = null;
	};

	let showProjectsModal = false;

	const handleProjectNameClick = () => {
		showProjectsModal = true;
	};

	const handleCloseProjectsModal = () => {
		showProjectsModal = false;
	};

	const handleNewProject = () => {
		showProjectsModal = false;
		dispatcher('newProject');
	};

	const handleProjectChange = (event: CustomEvent<string>) => {
		showProjectsModal = false;
		dispatcher('projectChange', event.detail);
	};
</script>

<div
	class="canvas"
	on:mousedown={handleDragCanvasStart}
	on:mousemove={handleDragCanvas}
	on:mouseup={handleDragCanvasEnd}
	on:click={handleCanvasDoubleClick}
	on:keypress={() => {}}
>
	<ProjectHeader
		projectName={chosenProjectName}
		{playing}
		on:playChange={handlePlayChange}
		on:projectNameClick={handleProjectNameClick}
	/>
	<ProjectsModal
		open={showProjectsModal}
		projects={projectNames}
		on:close={handleCloseProjectsModal}
		on:newProject={handleNewProject}
		on:projectChange={handleProjectChange}
		on:projectDelete
		on:projectNameChange
	/>
	<div class="audio-canvas" on:contextmenu={handleCanvasLeftClick} on:mousemove={handleLineDrag}>
		{#each Object.entries(audioGraphWithPositions) as [id, node] (id)}
			<DraggableNode
				{id}
				{node}
				running={playing}
				selected={selectedNodeIds.some((selectedId) => selectedId === id)}
				instantiatedNode={audioNodeDatabase[id]}
				position={node.ui?.position ?? { x: 0, y: 0 }}
				{draggingLine}
				on:drag={handleDragNode}
				on:nodePlugAndKnobPositions={handleNodePlugPositions}
				on:nodeParameterChange={handleNodeParameterChange}
				on:nodePlugClick={handlePlugClick}
				on:nodePlugUp={handlePlugUp}
				on:deleteNode={handleDeleteNode}
				on:knobMouseUp={handleKnobMouseUp}
				on:contextmenu={handleNodeLeftClick(id)}
				on:click={handleNodeClick(id)}
			/>
		{/each}
		{#if selectNodesStartPosition && selectNodesEndPosition}
			<div
				class="select"
				style="top: {Math.min(
					selectNodesStartPosition.y,
					selectNodesEndPosition.y
				)}px; left: {Math.min(
					selectNodesStartPosition.x,
					selectNodesEndPosition.x
				)}px; width: {Math.abs(
					selectNodesEndPosition.x - selectNodesStartPosition.x
				)}px; height: {Math.abs(selectNodesEndPosition.y - selectNodesStartPosition.y)}px;"
			/>
		{/if}
		<svg width="100vw" height="100vh">
			{#each linesToDisplay as line}
				<Line
					{line}
					{lineMenuPlugs}
					on:contextmenu={handleLineLeftClick(line.line[0], line.line[1])}
				/>
			{/each}

			{#if draggingLine}
				<line
					x1={positionOfStartingPlug.x}
					y1={positionOfStartingPlug.y}
					x2={positionOfEndPlug.x}
					y2={positionOfEndPlug.y}
					class="visible"
				/>
			{/if}
		</svg>

		{#if showMenu && menuKind === 'line'}
			<div class="create-node-menu" style="left: {menuPosition.x}px; top: {menuPosition.y}px;">
				<Menu>
					<MenuButton on:click={handleDeleteConnection} on:keypress={() => {}} variant="danger"
						>Delete</MenuButton
					>
				</Menu>
			</div>
		{/if}

		{#if showMenu && menuKind === 'node'}
			<div class="create-node-menu" style="left: {menuPosition.x}px; top: {menuPosition.y}px;">
				<Menu>
					{#if selectedNodeIds.some((id) => menuNodeId === id)}
						<div class="nodes-selected-header">{selectedNodeIds.length} nodes selected:</div>
					{/if}
					<MenuButton on:click={handleCopyNode}>Copy</MenuButton>
					<MenuButton on:click={handleDeleteNode} on:keypress={() => {}} variant="danger"
						>Delete</MenuButton
					>
				</Menu>
			</div>
		{/if}

		{#if showMenu && menuKind === 'canvas'}
			<div class="create-node-menu" style="left: {menuPosition.x}px; top: {menuPosition.y}px;">
				<ContextMenu on:create={handleCreateElementClick} on:paste={handlePasteClick} />
			</div>
		{/if}
	</div>
</div>

<style>
	.canvas {
		background-color: var(--neutral-700);
		overflow: hidden;
	}

	.create-node-menu {
		position: absolute;
	}

	svg {
		position: relative;
		pointer-events: none;
	}

	line.visible {
		stroke: var(--neutral-300);
	}

	.select {
		border: 1px solid var(--neutral-300);
		position: absolute;
		background-color: var(--neutral-500);
		opacity: 0.3;
	}

	.nodes-selected-header {
		font-size: 14px;
	}
</style>
