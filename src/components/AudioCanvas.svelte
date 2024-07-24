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

	let audioGraphHistory: SerializedAudioElements[] = [{}];
	let temporaryGraphHistory: SerializedAudioElements[] = [];
	$: audioGraph = temporaryGraphHistory.at(-1) ?? audioGraphHistory.at(-1) ?? {};

	const updateAudioGraphHistory = (
		map: (a: SerializedAudioElements) => SerializedAudioElements
	) => {
		if (temporaryGraphHistory.length >= 2) {
			temporaryGraphHistory = [...temporaryGraphHistory, map(temporaryGraphHistory.at(-1) ?? {})];

			updateAudioCanvas(
				temporaryGraphHistory.at(-1) ?? {},
				temporaryGraphHistory.at(-2) ?? {},
				audioNodeDatabase
			);
		} else {
			let newAudioGraphHistory = [...audioGraphHistory, map(audioGraphHistory.at(-1) ?? {})];

			if (newAudioGraphHistory.length > 100) {
				audioGraphHistory = audioGraphHistory.slice(audioGraphHistory.length - 100);
			}

			audioGraphHistory = newAudioGraphHistory;

			updateAudioCanvas(
				audioGraphHistory.at(-1) ?? {},
				audioGraphHistory.at(-2) ?? {},
				audioNodeDatabase
			);
		}
	};

	const undo = () => {
		const audioGraph = audioGraphHistory.at(-1) ?? {};
		const previousAudioGraph = audioGraphHistory.at(-2) ?? {};

		const newAudioGraphHistory = audioGraphHistory.slice(0, -1);

		if (newAudioGraphHistory.length < 2) return;

		audioGraphHistory = newAudioGraphHistory;

		updateAudioCanvas(previousAudioGraph, audioGraph, audioNodeDatabase);
	};

	const startTemporaryAction = () => {
		temporaryGraphHistory = [audioGraph, audioGraph];
	};

	const endTemporaryAction = () => {
		const temp = temporaryGraphHistory.at(-1);
		if (temp) {
			audioGraphHistory = [...audioGraphHistory, temp];
		}
		temporaryGraphHistory = [];
	};

	$: {
		if (temporaryGraphHistory.length === 0) {
			dispatcher('change', audioGraph);
		}
	}

	updateAudioGraphHistory(() => project.audioCanvas);

	onMount(() => {
		return () => {
			updateAudioCanvas({}, audioGraph, audioNodeDatabase);
		};
	});

	// $: {
	// 	console.log('audioGraph', audioGraph);
	// 	console.log('audioGraphHistory', audioGraphHistory);
	// 	console.log('temporaryGraphHistory', temporaryGraphHistory);
	// }

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

		dispatcher('canvasRelativePositionChange', canvasRelativePosition);

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
		startTemporaryAction();
	};

	const handleDragNode = (event: CustomEvent<{ x: number; y: number; id: string }>) => {
		translateEventWithPosition(event);

		if (selectedNodeIds.some((selectedId) => selectedId === event.detail.id)) {
			const draggedNode = audioGraph[event.detail.id];

			if (!draggedNode) return;

			const diffX = (draggedNode.ui?.position.x ?? 0) - event.detail.x;
			const diffY = (draggedNode.ui?.position.y ?? 0) - event.detail.y;

			updateAudioGraphHistory((audioGraph) =>
				selectedNodeIds.reduce((audioGraph, id) => {
					const node = audioGraph[id];

					if (!node) return audioGraph;

					return dragNode(
						{
							id,
							x: (node.ui?.position.x ?? 0) - diffX,
							y: (node.ui?.position.y ?? 0) - diffY
						},
						audioGraph
					);
				}, audioGraph)
			);
		} else {
			updateAudioGraphHistory((audioGraph) =>
				dragNode(
					{
						id: event.detail.id,
						x: event.detail.x,
						y: event.detail.y
					},
					audioGraph
				)
			);
		}

		updatePlugPositions();
	};

	const handleNodeDragEnd = () => {
		endTemporaryAction();
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
		startTemporaryAction();
	};

	const handleNodeParameterChange = (
		event: CustomEvent<{ id: string; parameterName: string; value: number }>
	) => {
		const { id, parameterName, value } = event.detail;

		updateAudioGraphHistory((audioGraph) => changeParameter(audioGraph, id, parameterName, value));
	};

	const handleNodeParameterChangeEnd = () => {
		endTemporaryAction();
	};

	const handleCreateElementClick = (
		event: CustomEvent<keyof typeof allowedSerializedAudioElementStaticDefinitions>
	) => {
		event.preventDefault();

		updateAudioGraphHistory((audioGraph) =>
			addNode(audioGraph, event.detail, translatePosition(menuPosition))
		);
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

		updateAudioGraphHistory((audioGraph) =>
			addConnectionToParameter(audioGraph, startingPlug!, {
				nodeId: event.detail.nodeId,
				type: 'input',
				id: event.detail.parameterName
			})
		);

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

		updateAudioGraphHistory((audioGraph) =>
			addConnectionToParameter(audioGraph, startingPlug!, {
				nodeId,
				type: 'input',
				id: parameterName
			})
		);

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

		try {
			updateAudioGraphHistory((audioGraph) =>
				addConnection(audioGraph, startingPlug!, { id, type, nodeId })
			);
		} catch {
			return false;
		}

		stopDragging();

		return true;
	};

	const handlePasteClick = () => {
		updateAudioGraphHistory((audioGraph) =>
			insertExistingNodes(audioGraph, copiedNodes, menuPosition)
		);
		closeMenu();
		updatePlugPositions();
	};

	const handleDeleteNode = () => {
		if (selectedNodeIds.some((selectedId) => selectedId === menuNodeId)) {
			updateAudioGraphHistory((audioGraph) => selectedNodeIds.reduce(removeNode, audioGraph));
		} else {
			updateAudioGraphHistory((audioGraph) => removeNode(audioGraph, menuNodeId));
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

	const handleNodeClick = (
		event: CustomEvent<{ id: string; position: Position; nodeType: NodeType }>
	) => {
		if (event.detail.nodeType === 'tutorial') {
			return;
		}

		if (draggingLine) {
			stopDragging();
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

		updateAudioGraphHistory((audioGraph) =>
			removeConnection(audioGraph, chosenLine!.line[0], chosenLine!.line[1])
		);
		closeMenu();
	};

	const openLineMultiplyMenu = (event: MouseEvent) => {
		event.stopPropagation();

		menuKind = 'line-multiply';
	};

	const handleMultiplyValueChangeStart = () => {
		startTemporaryAction();
	};

	const handleMultiplyValueChange = (
		event: CustomEvent<{ parameterName: string; value: number }>
	) => {
		const { value } = event.detail;

		if (!chosenLine) return;

		const nodeId = chosenLine.line[1].nodeId;
		const inputId = chosenLine.line[0].nodeId;

		updateAudioGraphHistory((audioGraph) =>
			changeParameterMultiply(audioGraph, nodeId, chosenLine!.line[1].id, inputId, value)
		);
		chosenLineMultiply = value;
	};

	const handleEndMultiplyValueChange = () => {
		endTemporaryAction();
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
			updateAudioGraphHistory((audioGraph) =>
				selectedNodeIds.reduce(
					(audioGraph, nodeId) =>
						changeNodeColor(nodeId, changedNodeColor ?? '#000000', audioGraph),
					audioGraph
				)
			);
		} else {
			updateAudioGraphHistory((audioGraph) =>
				changeNodeColor(changedColorNodeId, changedNodeColor!, audioGraph)
			);
		}

		closeChangeColorModal();
	};

	/* UNDO ----------------------------------------- */
	const handleCanvasKeypress = (event: KeyboardEvent) => {
		if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
			undo();
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
			<Line
				{line}
				{chosenLine}
				on:click={handleLineClick(line)}
				on:contextmenu={handleLineClick(line)}
			/>
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
	<div
		class="audio-canvas"
		on:pointerup={handleOpenContextMenu}
		on:contextmenu={(e) => e.preventDefault()}
		on:pointermove={handleLineDrag}
	>
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
					on:dragend={handleNodeDragEnd}
					on:nodeParameterChangeStart={handleNodeParameterChangeStart}
					on:nodeParameterChange={handleNodeParameterChange}
					on:nodeParameterChangeEnd={handleNodeParameterChangeEnd}
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
					on:mouseup={handleEndMultiplyValueChange}
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
		touch-action: none;
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
