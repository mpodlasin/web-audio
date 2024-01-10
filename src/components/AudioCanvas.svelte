<script lang="ts">
	import {
		type AudioNodeDatabase,
		type SerializedAudioElements,
		allowedSerializedAudioElementStaticDefinitions,
		updateAudioCanvas,
		addNode,
		addConnection,
		changeParameter,
		removeConnection,
		removeNode,
		addConnectionToParameter,
		type Position,
		insertExistingNodes,
		changeParameterMultiply
	} from '../audio/AudioCanvas';
	import DraggableNode from '../components/DraggableNode.svelte';
	import ProjectHeader from './ProjectHeader.svelte';
	import { getLinesToDisplay, type LineToDisplay } from '../ui/lines';
	import { addDiffToAllPositions, type PlugPositions } from '../ui/plugPositions';
	import ProjectsModal from './ProjectsModal.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Project } from '../ui/project';
	import Line from './Line.svelte';
	import ContextMenu from './ContextMenu.svelte';
	import { dragNode } from '../ui/dragNode';
	import MenuButton from './MenuButton.svelte';
	import { globalContext } from '../audio/GlobalContext';
	import ChangeColorModal from './ChangeColorModal.svelte';
	import Node from './Node.svelte';
	import { changeNodeColor } from '../ui/changeNodeColor';
	import Knob from './Knob.svelte';
	import PositionedMenu from './PositionedMenu.svelte';

	export let chosenProjectName: string;
	export let projectNames: string[];
	export let project: Project;

	let container: HTMLDivElement;

	let initialAudioCanvas = project.audioCanvas;

	let audioNodeDatabase: AudioNodeDatabase = {};

	let audioGraphHistory: SerializedAudioElements[] = [{}, initialAudioCanvas];

	let dragPosition: Position | null = null;
	let startDragPosition: Position | null = null;

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

	const handleTouchDragCanvasStart = (event: TouchEvent) => {
		audioGraphHistory = [...audioGraphHistory, audioGraph];
		event.preventDefault();
		const touch = event.touches[0];

		if (!touch) return;

		dragPosition = {
			x: touch.clientX,
			y: touch.clientY
		};

		startDragPosition = dragPosition;
	};

	const handleDragCanvasStart = (event: MouseEvent) => {
		audioGraphHistory = [...audioGraphHistory, audioGraph];
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

			startDragPosition = dragPosition;
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

	const handleTouchDragCanvas = (event: TouchEvent) => {
		event.preventDefault();
		const touch = event.touches[0];

		if (!touch) return;

		if (!dragPosition) return;

		const positionChange = {
			x: dragPosition.x - touch.clientX,
			y: dragPosition.y - touch.clientY
		};

		const newAudioGraphWithPositions = Object.fromEntries(
			Object.entries(audioGraph).map(([id, node]) => [
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

		audioGraphHistory = [...audioGraphHistory.slice(0, -1), newAudioGraphWithPositions];

		plugPositions = addDiffToAllPositions(plugPositions, -positionChange.x, -positionChange.y);

		dragPosition = {
			x: touch.clientX,
			y: touch.clientY
		};
	};

	const handleTouchDragCanvasEnd = (event: TouchEvent) => {
		const touch = event.changedTouches[0];

		if (!dragPosition) return;
		if (!startDragPosition) return;
		if (!touch) return;

		const positionChange = {
			x: Math.abs(dragPosition.x - startDragPosition.x),
			y: Math.abs(dragPosition.y - startDragPosition.y)
		};

		if (showMenu) {
			showMenu = false;
		} else {
			if (positionChange.x < 5 && positionChange.y < 5) {
				menuPosition = { x: touch.clientX, y: touch.clientY };
				showMenu = true;
				menuKind = 'canvas';
				chosenLine = null;
				chosenLineMultiply = undefined;
			}
		}

		dragPosition = null;
		selectNodesStartPosition = null;
		selectNodesEndPosition = null;
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
			Object.entries(audioGraph).map(([id, node]) => [
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

		audioGraphHistory = [...audioGraphHistory.slice(0, -1), newAudioGraphWithPositions];

		plugPositions = addDiffToAllPositions(plugPositions, -positionChange.x, -positionChange.y);

		dragPosition = {
			x: event.clientX,
			y: event.clientY
		};
	};

	$: previousAudioGraph = audioGraphHistory.at(-2) ?? {};
	$: audioGraph = audioGraphHistory.at(-1) ?? {};

	const dispatcher = createEventDispatcher();

	$: {
		dispatcher('change', audioGraph);
	}

	let selectedNodeIds: string[] = [];

	$: {
		if (selectNodesStartPosition && selectNodesEndPosition) {
			const filteredIds = Object.entries(audioGraph)
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

	const handleDragStart = () => {
		audioGraphHistory = [...audioGraphHistory, audioGraph];
	};

	const handleDragNode = (event: CustomEvent<{ x: number; y: number; id: string }>) => {
		if (selectedNodeIds.some((selectedId) => selectedId === event.detail.id)) {
			const draggedNode = audioGraph[event.detail.id];

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

	const handleNodePlugPositions = (
		event: CustomEvent<{
			id: string;
			inputPlugPositions: { [id: string]: Position };
			outputPlugPositions: { [id: string]: Position };
			parameterKnobPositions: { [id: string]: Position };
		}>
	) => {
		const { id, inputPlugPositions, outputPlugPositions, parameterKnobPositions } = event.detail;

		plugPositions[id] = {
			inputPlugPositions,
			outputPlugPositions,
			parameterKnobPositions
		};
	};

	$: linesToDisplay = getLinesToDisplay(audioGraph, plugPositions);

	const handleNodeParameterChangeStart = () => {
		audioGraphHistory = [...audioGraphHistory, audioGraph];
	};

	const handleNodeParameterChange = (
		event: CustomEvent<{ id: string; parameterName: string; value: number }>
	) => {
		const { id, parameterName, value } = event.detail;

		audioGraphHistory = [
			...audioGraphHistory.slice(0, -1),
			changeParameter(audioGraph, id, parameterName, value)
		];
	};

	$: {
		updateAudioCanvas(audioGraph, previousAudioGraph, audioNodeDatabase);
	}

	const handleCreateElementClick = (
		event: CustomEvent<keyof typeof allowedSerializedAudioElementStaticDefinitions>
	) => {
		event.preventDefault();

		audioGraphHistory = [...audioGraphHistory, addNode(audioGraph, event.detail, menuPosition)];

		closeMenu();
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

	const handlePlugTouchStart = (
		event: CustomEvent<{ id: string; type: 'input' | 'output'; nodeId: string }>
	) => {
		const { id, type, nodeId } = event.detail;

		draggingLine = true;
		startingPlug = { id, type, nodeId };
		positionOfStartingPlug =
			plugPositions[nodeId]?.[type === 'input' ? 'inputPlugPositions' : 'outputPlugPositions'][id]!;

		window.addEventListener('touchend', handleTouchLineDragStop, { once: true });
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
			addConnection(audioGraph, startingPlug, event.detail)
		];

		stopDragging();
	};

	const handleKnobMouseUp = (event: CustomEvent<{ nodeId: string; parameterName: string }>) => {
		if (!draggingLine) return;
		if (!startingPlug) return;

		audioGraphHistory = [
			...audioGraphHistory,
			addConnectionToParameter(audioGraph, startingPlug, {
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

	const handleTouchLineDrag = (event: TouchEvent) => {
		event.preventDefault();

		const touch = event.touches[0];

		if (!touch) return;

		positionOfEndPlug = { x: touch.clientX, y: touch.clientY };
	};

	const handleTouchLineDragStop = (event: TouchEvent) => {
		draggingLine = false;

		const changedTouch = event.changedTouches[0];

		if (!changedTouch) return;

		const element = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);

		if (!element) return;

		const plug = element.closest('[data-id]');

		if (!plug) return;

		const id = plug.getAttribute('data-id');

		if (!id) return;

		const nodeId = plug.getAttribute('data-node-id');

		if (!nodeId) return;

		const type = plug.getAttribute('data-type') as 'input' | 'output' | null;

		if (!type) return;

		if (!startingPlug) return;

		audioGraphHistory = [
			...audioGraphHistory,
			addConnection(audioGraph, startingPlug, { id, type, nodeId })
		];

		stopDragging();
	};

	/* ----------------------------------------------------------- */

	const handleDeleteConnection = () => {
		if (!chosenLine) return;

		audioGraphHistory = [
			...audioGraphHistory,
			removeConnection(audioGraph, chosenLine.line[0], chosenLine.line[1])
		];

		closeMenu();
	};

	let copiedNodes: string[] = [];

	const handleCopyNode = () => {
		if (selectedNodeIds.some((id) => id === menuNodeId)) {
			copiedNodes = selectedNodeIds;
		} else {
			copiedNodes = [menuNodeId];
		}
		closeMenu();
	};

	const handlePasteClick = () => {
		const newAudioGraph = insertExistingNodes(audioGraph, copiedNodes, menuPosition);
		audioGraphHistory = [...audioGraphHistory, newAudioGraph];
		closeMenu();
	};

	const handleDeleteNode = () => {
		if (selectedNodeIds.some((selectedId) => selectedId === menuNodeId)) {
			const newAudioGraph = selectedNodeIds.reduce(removeNode, audioGraph);

			audioGraphHistory = [...audioGraphHistory, newAudioGraph];
		} else {
			audioGraphHistory = [...audioGraphHistory, removeNode(audioGraph, menuNodeId)];
		}
		closeMenu();
	};

	let playing = false;

	const handlePlayChange = (event: CustomEvent<{ playing: boolean }>) => {
		playing = event.detail.playing;
	};

	$: {
		if (playing) {
			globalContext.resume();
		} else {
			globalContext.suspend();
		}
	}

	/* ---------------------------------------------- */
	/* CONTEXT MENU */

	let menuPosition = { x: 0, y: 0 };
	let showMenu = false;
	let menuKind: 'canvas' | 'node' | 'line' | 'line-multiply' = 'canvas';
	let chosenLine: LineToDisplay | null = null;
	let menuNodeId: string = '';

	$: chosenLineMultiply = chosenLine?.multiply;

	const handleCanvasLeftClick = (event: MouseEvent) => {
		event.preventDefault();

		menuPosition = { x: event.clientX, y: event.clientY };
		showMenu = true;
		menuKind = 'canvas';
		chosenLine = null;
		chosenLineMultiply = undefined;
	};

	const handleLineLeftClick = (line: LineToDisplay) => (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();

		showMenu = true;
		menuKind = 'line';
		chosenLine = line;
		menuPosition = { x: event.clientX, y: event.clientY };
	};

	const handleNodeLeftClick = (nodeId: string) => (event: MouseEvent) => {
		event.preventDefault();

		menuPosition = { x: event.clientX, y: event.clientY };
		showMenu = true;
		menuKind = 'node';
		chosenLine = null;
		menuNodeId = nodeId;
	};

	const closeMenu = () => {
		showMenu = false;
		chosenLine = null;
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

	let changeColorModalIsOpen = false;
	let changedColorNodeId = '';
	$: changedColorNode = audioGraph[changedColorNodeId];
	let changedNodeColor: string | undefined;

	const openChangeColorModal = (nodeId: string) => () => {
		changeColorModalIsOpen = true;
		changedColorNodeId = nodeId;
		changedNodeColor = audioGraph[nodeId]?.ui?.primmaryColor;
		closeMenu();
	};

	const closeChangeColorModal = () => {
		changeColorModalIsOpen = false;
	};

	const handleColorChange = (event: CustomEvent<string>) => {
		changedNodeColor = event.detail;
	};

	const handleConfirmChange = () => {
		if (!changedNodeColor) return;

		if (selectedNodeIds.some((selectedNodeId) => selectedNodeId === changedColorNodeId)) {
			audioGraphHistory = [
				...audioGraphHistory,
				selectedNodeIds.reduce(
					(audioGraph, nodeId) =>
						changeNodeColor(nodeId, changedNodeColor ?? '#000000', audioGraph),
					audioGraph
				)
			];
		} else {
			audioGraphHistory = [
				...audioGraphHistory,
				changeNodeColor(changedColorNodeId, changedNodeColor, audioGraph)
			];
		}

		closeChangeColorModal();
	};

	$: {
		if (audioGraphHistory.length > 100) {
			audioGraphHistory = audioGraphHistory.slice(audioGraphHistory.length - 100);
		}
	}

	const handleCanvasKeypress = (event: KeyboardEvent) => {
		if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
			if (audioGraphHistory.length > 2) {
				audioGraphHistory = audioGraphHistory.slice(0, -1);
			}
		}
	};

	window.addEventListener('keydown', handleCanvasKeypress);

	const openLineMultiplyMenu = (event: MouseEvent) => {
		event.stopPropagation();

		menuKind = 'line-multiply';
	};

	const handleMultiplyValueChangeStart = (event: CustomEvent) => {
		audioGraphHistory = [...audioGraphHistory, audioGraph];
	};

	const handleMultiplyValueChange = (
		event: CustomEvent<{ parameterName: string; value: number }>
	) => {
		const { value } = event.detail;

		if (!chosenLine) return;

		const nodeId = chosenLine.line[1].nodeId;
		const inputId = chosenLine.line[0].nodeId;

		audioGraphHistory = [
			...audioGraphHistory.slice(0, -1),
			changeParameterMultiply(audioGraph, nodeId, chosenLine.line[1].id, inputId, value)
		];
		chosenLineMultiply = value;
	};
</script>

<div
	class="canvas"
	on:mousedown={handleDragCanvasStart}
	on:mousemove={handleDragCanvas}
	on:mouseup={handleDragCanvasEnd}
	on:touchstart={handleTouchDragCanvasStart}
	on:touchmove={handleTouchDragCanvas}
	on:touchend={handleTouchDragCanvasEnd}
	on:click={handleCanvasDoubleClick}
	on:keydown={() => {}}
	bind:this={container}
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
	<div
		class="audio-canvas"
		on:contextmenu={handleCanvasLeftClick}
		on:mousemove={handleLineDrag}
		on:touchmove={handleTouchLineDrag}
		on:touchend={handleTouchLineDragStop}
	>
		{#each Object.entries(audioGraph) as [id, node] (id)}
			<DraggableNode
				{id}
				{node}
				running={playing}
				selected={selectedNodeIds.some((selectedId) => selectedId === id)}
				instantiatedNode={audioNodeDatabase[id]}
				position={{ x: node.ui?.position.x ?? 0, y: node.ui?.position.y ?? 0 }}
				color={node.ui?.primmaryColor}
				{draggingLine}
				on:drag={handleDragNode}
				on:dragstart={handleDragStart}
				on:nodePlugAndKnobPositions={handleNodePlugPositions}
				on:nodeParameterChangeStart={handleNodeParameterChangeStart}
				on:nodeParameterChange={handleNodeParameterChange}
				on:nodePlugClick={handlePlugClick}
				on:nodePlugTouchStart={handlePlugTouchStart}
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
				<Line {line} {chosenLine} on:contextmenu={handleLineLeftClick(line)} />
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
			<PositionedMenu position={menuPosition} on:close={closeMenu}>
				{#if chosenLineMultiply !== undefined}
					<MenuButton on:click={openLineMultiplyMenu}
						>Mult: {chosenLineMultiply.toFixed(2)}</MenuButton
					>
				{/if}
				<MenuButton on:click={handleDeleteConnection} on:keypress={() => {}} variant="danger"
					>Delete</MenuButton
				>
			</PositionedMenu>
		{/if}

		{#if showMenu && menuKind === 'node'}
			<PositionedMenu position={menuPosition} on:close={closeMenu}>
				{#if selectedNodeIds.some((id) => menuNodeId === id)}
					<div class="nodes-selected-header">{selectedNodeIds.length} nodes selected:</div>
				{/if}
				<MenuButton on:click={openChangeColorModal(menuNodeId)}>Color</MenuButton>
				<MenuButton on:click={handleCopyNode}>Copy</MenuButton>
				<MenuButton on:click={handleDeleteNode} on:keypress={() => {}} variant="danger"
					>Delete</MenuButton
				>
			</PositionedMenu>
		{/if}

		{#if showMenu && menuKind === 'canvas'}
			<ContextMenu
				position={menuPosition}
				on:create={handleCreateElementClick}
				on:paste={handlePasteClick}
				on:close={closeMenu}
			/>
		{/if}

		{#if showMenu && menuKind === 'line-multiply'}
			<PositionedMenu position={menuPosition} on:close={closeMenu}>
				<Knob
					parameterName="mult"
					parameter={{ base: chosenLineMultiply ?? 1, inputs: [] }}
					defaultValue={1}
					minValue={0}
					maxValue={10_000}
					polarity="uni"
					draggingLine={false}
					audioParamAnalyser={undefined}
					on:change={handleMultiplyValueChange}
					on:mousedown={handleMultiplyValueChangeStart}
				/>
			</PositionedMenu>
		{/if}

		{#if changeColorModalIsOpen}
			<ChangeColorModal
				value={changedNodeColor}
				open
				on:change={handleColorChange}
				on:confirm={handleConfirmChange}
				on:close={closeChangeColorModal}
			>
				<div slot="node">
					{#if changedColorNode}
						<Node
							color={changedNodeColor}
							node={changedColorNode}
							id={changedColorNodeId}
							instantiatedNode={null}
							draggingLine={false}
							running={playing}
						/>
					{/if}
				</div>
			</ChangeColorModal>
		{/if}
	</div>
</div>

<style>
	.canvas {
		background-color: var(--neutral-700);
		overflow: hidden;
		position: relative;
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
