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
		changeParameterMultiply,

		type NodeType

	} from '../audio/AudioCanvas';
	import DraggableNode from '../components/DraggableNode.svelte';
	import ProjectHeader from './ProjectHeader.svelte';
	import { getLinesToDisplay, type LineToDisplay } from '../ui/lines';
	import ProjectsModal from './ProjectsModal.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
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
	import { isAlternativeKey } from '../ui/isAlternativeKey';
	import type { PlugPositions } from '../ui/plugPositions';
	import { goto } from '$app/navigation';
	import { DISTANCE_THAT_IS_CONSIDERED_DRAG } from '../constants';

	export let chosenProjectName: string;
	export let projectNames: string[];
	export let project: Project;
	export let tutorialMode = false;

	const dispatcher = createEventDispatcher();

	let container: HTMLDivElement;

	let audioNodeDatabase: AudioNodeDatabase = {};

	let audioGraphHistory: SerializedAudioElements[] = [{}, project.audioCanvas];
	$: previousAudioGraph = audioGraphHistory.at(-2) ?? {};
	$: audioGraph = audioGraphHistory.at(-1) ?? {};

	$: {
		dispatcher('change', audioGraph);
	}

	$: {
		updateAudioCanvas(audioGraph, previousAudioGraph, audioNodeDatabase);
	}

	$: {
		if (audioGraphHistory.length > 100) {
			audioGraphHistory = audioGraphHistory.slice(audioGraphHistory.length - 100);
		}
	}

	/* DRAGGING CANVAS ----------------------------------------- */
	let canvasRelativePosition: Position = project.canvasRelativePosition;
	let lastDragPosition: Position | null = null;
	let draggedDistance = 0;

	const translatePosition = (position: Position) => {
		return {
			x: (position.x - canvasRelativePosition.x) / size,
			y: (position.y - canvasRelativePosition.y) / size
		};
	};

	const translateEventWithPosition = <E extends Position>(event: CustomEvent<E>) => {
		const translatedPosition = translatePosition(event.detail);

		event.detail.x = translatedPosition.x;
		event.detail.y = translatedPosition.y;
	};

	$: {
		dispatcher('canvasRelativePositionChange', canvasRelativePosition);
	}

	const handleDragCanvasStart = (event: PointerEvent) => {
		if (event.button === 2) return;

		event.preventDefault();

		const position = {
			x: event.clientX,
			y: event.clientY
		};

		lastDragPosition = position;

		draggedDistance = 0;
	};

	const handleDragCanvasEnd = (event: PointerEvent) => {
		event.preventDefault();

		lastDragPosition = null;
	};

	const handleDragCanvas = (event: PointerEvent) => {
		event.preventDefault();

		if (!lastDragPosition) return;

		const position = {
			x: event.clientX,
			y: event.clientY
		};

		const dragDifference = {
			x: position.x - lastDragPosition.x,
			y: position.y - lastDragPosition.y
		};

		draggedDistance += Math.sqrt(dragDifference.x ** 2 + dragDifference.y ** 2);

		canvasRelativePosition = {
			x: canvasRelativePosition.x + dragDifference.x,
			y: canvasRelativePosition.y + dragDifference.y
		};

		lastDragPosition = position;

		updatePlugPositions();
	};

	/* SELECTING NODES ----------------------------------------- */
	let selectedNodeIds: string[] = [];
	let selectNodesStartPosition: Position | null = null;
	let selectNodesEndPosition: Position | null = null;

	const handleStartSelectingNodes = (event: PointerEvent) => {
		event.preventDefault();
		audioGraphHistory = [...audioGraphHistory, audioGraph];

		if (isAlternativeKey(event)) {
			if (!event.shiftKey) {
				selectedNodeIds = [];
			}
			selectNodesStartPosition = {
				x: event.clientX,
				y: event.clientY
			};
		}
	};

	const handleCanvasDoubleClick = (event: MouseEvent) => {
		if (event.detail === 2) {
			selectedNodeIds = [];
		}
	};

	const handleSelectNodesDrag = (event: PointerEvent) => {
		if (!selectNodesStartPosition) return;

		selectNodesEndPosition = {
			x: event.clientX,
			y: event.clientY
		};
	};

	const handleSelectNodeClick = (id: string) => (event: MouseEvent) => {
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

	const handleSelectNodesEnd = () => {
		selectNodesStartPosition = null;
		selectNodesEndPosition = null;
	};

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

	/* DRAGGING NODES ----------------------------------------- */
	const handleDragStart = () => {
		audioGraphHistory = [...audioGraphHistory, audioGraph];
	};

	const handleDragNode = (event: CustomEvent<{ x: number; y: number; id: string }>) => {
		translateEventWithPosition(event);

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
					audioGraphHistory
				);
			}, audioGraphHistory);
		} else {
			audioGraphHistory = dragNode(
				{
					id: event.detail.id,
					x: event.detail.x,
					y: event.detail.y
				},
				audioGraphHistory
			);
		}

		updatePlugPositions();
	};

	/* PLUG POSITIONS ----------------------------------------- */

	let plugs: HTMLDivElement[] = [];
	let knobs: HTMLDivElement[] = [];

	const handlePlugCreated = (event: CustomEvent<HTMLDivElement>) => {
		plugs = [...plugs, event.detail];
	};

	const handleKnobCreated = (event: CustomEvent<HTMLDivElement>) => {
		knobs = [...knobs, event.detail];
	};

	const getPlugPositions = (): PlugPositions => {
		const plugPositions: PlugPositions = {};

		plugs.forEach((plug) => {
			const id = plug.getAttribute('data-id');
			const nodeId = plug.getAttribute('data-node-id');
			const type = plug.getAttribute('data-type') as 'input' | 'output' | null;

			if (!id) return;
			if (!nodeId) return;
			if (!type) return;

			const rect = plug.getBoundingClientRect();

			if (!plugPositions[nodeId]) {
				plugPositions[nodeId] = {
					inputPlugPositions: {},
					outputPlugPositions: {},
					parameterKnobPositions: {}
				};
			}

			if (type === 'input') {
				plugPositions[nodeId]!.inputPlugPositions[id] = {
					x: rect.left + rect.width / 2,
					y: rect.top + rect.height / 2
				};
			} else {
				plugPositions[nodeId]!.outputPlugPositions[id] = {
					x: rect.left + rect.width / 2,
					y: rect.top + rect.height / 2
				};
			}
		});

		knobs.forEach((knob) => {
			const nodeId = knob.getAttribute('data-node-id');
			const parameterName = knob.getAttribute('data-parameter-name');

			if (!nodeId) return;
			if (!parameterName) return;

			const rect = knob.getBoundingClientRect();

			if (!plugPositions[nodeId]) {
				plugPositions[nodeId] = {
					inputPlugPositions: {},
					outputPlugPositions: {},
					parameterKnobPositions: {}
				};
			}

			plugPositions[nodeId]!.parameterKnobPositions[parameterName] = {
				x: rect.left + rect.width / 2,
				y: rect.top + rect.height / 2
			};
		});

		return plugPositions;
	};

	let plugPositions: PlugPositions = {};

	onMount(() => {
		updatePlugPositions();
	});

	const updatePlugPositions = () => {
		requestAnimationFrame(() => {
			plugPositions = getPlugPositions();
		});
	};

	$: linesToDisplay = getLinesToDisplay(audioGraph, plugPositions);

	/* NODE PARAMETER CHANGE ----------------------------------------- */
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

	const handleCreateElementClick = (
		event: CustomEvent<keyof typeof allowedSerializedAudioElementStaticDefinitions>
	) => {
		event.preventDefault();

		audioGraphHistory = [
			...audioGraphHistory,
			addNode(audioGraph, event.detail, translatePosition(menuPosition))
		];

		updatePlugPositions();

		closeMenu();
	};

	/* LINE DRAGGING ----------------------------------------- */
	let draggingLine = false;
	let startingPlug: { id: string; type: 'input' | 'output'; nodeId: string } | null = null;
	let positionOfStartingPlug: { x: number; y: number } = { x: 0, y: 0 };
	let positionOfEndPlug: { x: number; y: number } | null = null;

	const handlePlugDown = (
		event: CustomEvent<{ id: string; type: 'input' | 'output'; nodeId: string }>
	) => {
		const { id, type, nodeId } = event.detail;

		draggingLine = true;
		startingPlug = { id, type, nodeId };
		const rawPositionOfStartingPlug =
			plugPositions[nodeId]?.[type === 'input' ? 'inputPlugPositions' : 'outputPlugPositions'][id]!;

		positionOfStartingPlug = {
			x: rawPositionOfStartingPlug.x,
			y: rawPositionOfStartingPlug.y
		};

		window.addEventListener('pointerup', stopDragging, { once: true });
	};

	const stopDragging = () => {
		draggingLine = false;
		startingPlug = null;
		positionOfStartingPlug = { x: 0, y: 0 };
		positionOfEndPlug = null;
	};

	const handleLineDrag = (event: PointerEvent) => {
		if (!draggingLine) return;

		event.preventDefault();
		const position = { x: event.clientX, y: event.clientY };

		positionOfEndPlug = {
			x: position.x,
			y: position.y
		};
	};

	const handlePlugUp = (
		event: CustomEvent<{
			id: string;
			type: 'input' | 'output';
			nodeId: string;
			event: PointerEvent;
		}>
	) => {
		const connectedToPlug = handleLineDragStopForPlug(event.detail.event);

		if (connectedToPlug) return;

		const connectedToKnob = handleLineDragStopForKnob(event.detail.event);

		if (connectedToKnob) return;

		stopDragging();
	};

	const handleKnobMouseUp = (
		event: CustomEvent<{ nodeId: string; parameterName: string; event: PointerEvent }>
	) => {
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

	const handleLineDragStopForKnob = (event: PointerEvent) => {
		if (!draggingLine) return false;
		if (!startingPlug) return false;

		const element = document.elementFromPoint(event.clientX, event.clientY);

		if (!element) return false;

		const knob = element.closest('[data-parameter-name]');

		if (!knob) return false;

		const parameterName = knob.getAttribute('data-parameter-name');

		if (!parameterName) return false;

		const nodeId = knob.getAttribute('data-node-id');

		if (!nodeId) return false;

		audioGraphHistory = [
			...audioGraphHistory,
			addConnectionToParameter(audioGraph, startingPlug, {
				nodeId,
				type: 'input',
				id: parameterName
			})
		];

		stopDragging();

		return true;
	};

	const handleLineDragStopForPlug = (event: PointerEvent) => {
		if (!draggingLine) return false;
		if (!startingPlug) return false;

		const element = document.elementFromPoint(event.clientX, event.clientY);

		if (!element) return false;

		const plug = element.closest('[data-id]');

		if (!plug) return false;

		const id = plug.getAttribute('data-id');

		if (!id) return false;

		const nodeId = plug.getAttribute('data-node-id');

		if (!nodeId) return false;

		const type = plug.getAttribute('data-type') as 'input' | 'output' | null;

		if (!type) return false;

		audioGraphHistory = [
			...audioGraphHistory,
			addConnection(audioGraph, startingPlug, { id, type, nodeId })
		];

		stopDragging();

		return true;
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

	/* PLAYING ----------------------------------------- */
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

	const handleOpenContextMenu = (event: PointerEvent) => {
		const wasNotDragging = draggedDistance < DISTANCE_THAT_IS_CONSIDERED_DRAG;

		if (draggingLine) return;

		if (showMenu) {
			closeMenu();
			return;
		} else if (wasNotDragging) {
			menuPosition = { x: event.clientX, y: event.clientY };
		} else {
			return;
		}

		showMenu = true;
		menuKind = 'canvas';
		chosenLine = null;
		chosenLineMultiply = undefined;
	};

	const closeMenu = () => {
		showMenu = false;
		chosenLine = null;
	};

	const handleLineClick = (line: LineToDisplay) => (event: MouseEvent) => {
		event.stopPropagation();
		event.preventDefault();
		menuPosition = { x: event.clientX, y: event.clientY };
		showMenu = true;
		menuKind = 'line';
		chosenLine = line;
	};

	const handleNodeClick = (event: CustomEvent<{ id: string; position: Position, nodeType: NodeType }>) => {
		if (event.detail.nodeType === 'tutorial') {
			return;
		}

		menuPosition = event.detail.position;
		showMenu = true;
		menuKind = 'node';
		chosenLine = null;
		menuNodeId = event.detail.id;
	};

	/* LINE CONTEXT MENU ----------------------------------------- */
	const handleDeleteConnection = (event: MouseEvent) => {
		event.stopPropagation();

		if (!chosenLine) return;

		audioGraphHistory = [
			...audioGraphHistory,
			removeConnection(audioGraph, chosenLine.line[0], chosenLine.line[1])
		];

		closeMenu();
	};

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

	/* NODE CONTEXT MENU ----------------------------------------- */
	let copiedNodes: string[] = [];
	const handleCopyNode = () => {
		if (selectedNodeIds.some((id) => id === menuNodeId)) {
			copiedNodes = selectedNodeIds;
		} else {
			copiedNodes = [menuNodeId];
		}
		closeMenu();
	};

	/* PROJECTS ----------------------------------------- */
	let showProjectsModal = false;

	const handleProjectNameClick = () => {
		if (tutorialMode) {
			goto('/learn');
			return;
		}

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

	/* CHANGE COLOR ----------------------------------------- */
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

	/* UNDO ----------------------------------------- */
	const handleCanvasKeypress = (event: KeyboardEvent) => {
		if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
			if (audioGraphHistory.length > 2) {
				audioGraphHistory = audioGraphHistory.slice(0, -1);
			}
		}
	};
	window.addEventListener('keydown', handleCanvasKeypress);

	/* RESIZE ----------------------------------------- */
	let size = project.size;

	const makeStuffSmaller = () => {
		size = size - 0.1;

		updatePlugPositions();

		dispatcher('sizeChange', size);
	};

	const makeStuffBigger = () => {
		size = size + 0.1;

		updatePlugPositions();

		dispatcher('sizeChange', size);
	};
</script>

<div
	class="canvas"
	on:pointerdown={handleStartSelectingNodes}
	on:pointermove={handleSelectNodesDrag}
	on:mouseup={handleSelectNodesEnd}
	on:pointerdown={handleDragCanvasStart}
	on:pointermove={handleDragCanvas}
	on:pointerup={handleDragCanvasEnd}
	on:click={handleCanvasDoubleClick}
	on:keydown={() => {}}
	bind:this={container}
>
	<ProjectHeader
		projectName={chosenProjectName}
		{playing}
		on:playChange={handlePlayChange}
		on:projectNameClick={handleProjectNameClick}
		on:makeStuffSmaller={makeStuffSmaller}
		on:makeStuffBigger={makeStuffBigger}
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
	<svg width="100vw" height="100vh">
		{#each linesToDisplay as line (line.key)}
			<Line {line} {chosenLine} on:click={handleLineClick(line)} />
		{/each}
		{#if draggingLine && positionOfEndPlug}
			<line
				x1={positionOfStartingPlug.x}
				y1={positionOfStartingPlug.y}
				x2={positionOfEndPlug.x}
				y2={positionOfEndPlug.y}
				class="visible"
			/>
		{/if}
	</svg>
	<div class="audio-canvas" on:pointerup={handleOpenContextMenu} on:pointermove={handleLineDrag}>
		<div
			class="nodes"
			style="transform: translate({canvasRelativePosition.x}px, {canvasRelativePosition.y}px) scale({size});"
		>
			{#each Object.entries(audioGraph) as [id, node] (id)}
				<DraggableNode
					{id}
					{node}
					{audioGraph}
					running={playing}
					selected={selectedNodeIds.some((selectedId) => selectedId === id)}
					instantiatedNode={audioNodeDatabase[id]}
					position={{ x: node.ui?.position.x ?? 0, y: node.ui?.position.y ?? 0 }}
					color={node.ui?.primmaryColor}
					{draggingLine}
					on:drag={handleDragNode}
					on:dragstart={handleDragStart}
					on:nodeParameterChangeStart={handleNodeParameterChangeStart}
					on:nodeParameterChange={handleNodeParameterChange}
					on:nodePlugDown={handlePlugDown}
					on:nodePlugUp={handlePlugUp}
					on:deleteNode={handleDeleteNode}
					on:knobMouseUp={handleKnobMouseUp}
					on:contextmenu={handleNodeClick}
					on:click={handleSelectNodeClick(id)}
					on:plugCreated={handlePlugCreated}
					on:knobCreated={handleKnobCreated}
				/>
			{/each}
		</div>
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
					nodeId=""
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
							{audioGraph}
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
		width: 100vw;
		height: 100vh;
	}

	.audio-canvas {
		height: 100%;
	}

	svg {
		pointer-events: none;
		position: fixed;
		z-index: 10;
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

	.nodes {
		transform-origin: top left;
	}
</style>
