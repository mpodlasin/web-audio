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
		type NodeType,
		changeComment
	} from '../audio/AudioCanvas';
	import DraggableNode from './DraggableNode.svelte';
	import ProjectHeader from './ProjectHeader.svelte';
	import { getLinesToDisplay, type LineToDisplay } from '../ui/lines';
	import ProjectsModal from './ProjectsModal.svelte';
	import { onMount } from 'svelte';
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

	interface Props {
		chosenProjectName: string;
		projectNames: string[];
		project: Project;
		tutorialMode?: boolean;
		onCanvasRelativePositionChange(position: Position): void;
		onNewProject?(): void;
		onProjectChange?(projectName: string): void;
		onSizeChange(size: number): void;
		onProjectDelete?(projectName: string): void;
		onProjectNameChange?(event: { oldName: string; newName: string }): void;
		onChange(audioGraph: SerializedAudioElements): void;
	}

	let {
		chosenProjectName,
		projectNames,
		project,
		tutorialMode = false,
		onCanvasRelativePositionChange,
		onNewProject,
		onProjectChange,
		onSizeChange,
		onProjectDelete,
		onProjectNameChange,
		onChange
	}: Props = $props();

	let container: HTMLDivElement | undefined = $state();

	let audioNodeDatabase: AudioNodeDatabase = $state({});

	let audioGraphHistory: SerializedAudioElements[] = $state([{}]);
	let temporaryGraphHistory: SerializedAudioElements[] = $state([]);
	let audioGraph = $derived(temporaryGraphHistory.at(-1) ?? audioGraphHistory.at(-1) ?? {});

	const updateAudioGraphHistory = (
		map: (a: SerializedAudioElements) => SerializedAudioElements
	) => {
		if (temporaryGraphHistory.length >= 2) {
			temporaryGraphHistory = [...temporaryGraphHistory, map(temporaryGraphHistory.at(-1) ?? {})];

			audioNodeDatabase = updateAudioCanvas(
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

			audioNodeDatabase = updateAudioCanvas(
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

		audioNodeDatabase = updateAudioCanvas(previousAudioGraph, audioGraph, audioNodeDatabase);
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

	$effect(() => {
		if (temporaryGraphHistory.length === 0) {
			onChange(audioGraph);
		}
	});

	onMount(() => {
		updateAudioGraphHistory(() => project.audioCanvas);
		return () => {
			audioNodeDatabase = updateAudioCanvas({}, audioGraph, audioNodeDatabase);
		};
	});

	/* DRAGGING CANVAS ----------------------------------------- */
	let canvasRelativePosition: Position = $state(project.canvasRelativePosition);
	let lastDragPosition: Position | null = null;
	let draggedDistance = 0;

	const translatePosition = (position: Position) => {
		return {
			x: (position.x - canvasRelativePosition.x) / size,
			y: (position.y - canvasRelativePosition.y) / size
		};
	};

	const translateEventWithPosition = <E extends Position>(event: E) => {
		const translatedPosition = translatePosition(event);

		event.x = translatedPosition.x;
		event.y = translatedPosition.y;
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

		onCanvasRelativePositionChange(canvasRelativePosition);

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
	let selectedNodeIds: string[] = $state([]);
	let selectNodesStartPosition: Position | null = $state(null);
	let selectNodesEndPosition: Position | null = $state(null);

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

	$effect(() => {
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
	});

	/* DRAGGING NODES ----------------------------------------- */
	const handleDragStart = () => {
		startTemporaryAction();
	};

	const handleDragNode = (event: { x: number; y: number; id: string }) => {
		translateEventWithPosition(event);

		if (selectedNodeIds.some((selectedId) => selectedId === event.id)) {
			const draggedNode = audioGraph[event.id];

			if (!draggedNode) return;

			const diffX = (draggedNode.ui?.position.x ?? 0) - event.x;
			const diffY = (draggedNode.ui?.position.y ?? 0) - event.y;

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
						id: event.id,
						x: event.x,
						y: event.y
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

	let plugs: HTMLElement[] = [];
	let knobs: HTMLElement[] = [];

	const handlePlugCreated = (event: HTMLElement) => {
		plugs = [...plugs, event];
	};

	const handleKnobCreated = (event: HTMLElement) => {
		knobs = [...knobs, event];
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

	let plugPositions: PlugPositions = $state({});

	onMount(() => {
		updatePlugPositions();
	});

	const updatePlugPositions = () => {
		requestAnimationFrame(() => {
			plugPositions = getPlugPositions();
		});
	};

	let linesToDisplay = $derived(getLinesToDisplay(audioGraph, plugPositions));

	/* NODE PARAMETER CHANGE ----------------------------------------- */
	const handleNodeParameterChangeStart = () => {
		startTemporaryAction();
	};

	const handleNodeParameterChange = (event: {
		id: string;
		parameterName: string;
		value: number;
	}) => {
		const { id, parameterName, value } = event;

		updateAudioGraphHistory((audioGraph) => changeParameter(audioGraph, id, parameterName, value));
	};

	const handleNodeParameterChangeEnd = () => {
		endTemporaryAction();
	};

	const handleCreateElementClick = (
		nodeType: keyof typeof allowedSerializedAudioElementStaticDefinitions
	) => {
		updateAudioGraphHistory((audioGraph) =>
			addNode(audioGraph, nodeType, translatePosition(menuPosition))
		);
		updatePlugPositions();
		closeMenu();
	};

	/* LINE DRAGGING ----------------------------------------- */
	let draggingLine = $state(false);
	let startingPlug: { id: string; type: 'input' | 'output'; nodeId: string } | null = null;
	let positionOfStartingPlug: { x: number; y: number } = $state({ x: 0, y: 0 });
	let positionOfEndPlug: { x: number; y: number } | null = $state(null);

	const handlePlugDown = (event: { plugId: string; type: 'input' | 'output'; nodeId: string }) => {
		const { plugId, type, nodeId } = event;

		draggingLine = true;
		startingPlug = { id: plugId, type, nodeId };
		const rawPositionOfStartingPlug =
			plugPositions[nodeId]?.[type === 'input' ? 'inputPlugPositions' : 'outputPlugPositions'][
				plugId
			]!;

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

	const handlePlugUp = (event: {
		plugId: string;
		type: 'input' | 'output';
		nodeId: string;
		event: PointerEvent;
	}) => {
		const connectedToPlug = handleLineDragStopForPlug(event.event);

		if (connectedToPlug) return;

		const connectedToKnob = handleLineDragStopForKnob(event.event);

		if (connectedToKnob) return;

		stopDragging();
	};

	const handleKnobMouseUp = (event: {
		nodeId: string;
		parameterName: string;
		event: PointerEvent;
	}) => {
		if (!draggingLine) return;
		if (!startingPlug) return;

		updateAudioGraphHistory((audioGraph) =>
			addConnectionToParameter(audioGraph, startingPlug!, {
				nodeId: event.nodeId,
				type: 'input',
				id: event.parameterName
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
	let playing = $state(false);

	const handlePlayChange = (event: CustomEvent<{ playing: boolean }>) => {
		playing = event.detail.playing;
	};

	$effect(() => {
		if (playing) {
			globalContext.resume();
		} else {
			globalContext.suspend();
		}
	});

	/* ---------------------------------------------- */
	/* CONTEXT MENU */

	let menuPosition = $state({ x: 0, y: 0 });
	let showMenu = $state(false);
	let menuKind: 'canvas' | 'node' | 'line' | 'line-multiply' = $state('canvas');
	let chosenLine: LineToDisplay | null = $state(null);
	let menuNodeId: string = $state('');
	let chosenLineMultiply = $derived((chosenLine as any)?.multiply);

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

	const handleNodeClick = (event: { id: string; position: Position; nodeType: NodeType }) => {
		if (event.nodeType === 'tutorial') {
			return;
		}

		if (draggingLine) {
			stopDragging();
			return;
		}

		menuPosition = event.position;
		showMenu = true;
		menuKind = 'node';
		chosenLine = null;
		menuNodeId = event.id;
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

	const handleMultiplyValueChange = (event: { parameterName: string; value: number }) => {
		const { value } = event;

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
	let showProjectsModal = $state(false);

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
		onNewProject?.();
	};

	const handleProjectChange = (projectName: string) => {
		showProjectsModal = false;
		onProjectChange?.(projectName);
	};

	/* CHANGE COLOR ----------------------------------------- */
	let changeColorModalIsOpen = $state(false);
	let changedColorNodeId = $state('');
	let changedColorNode = $derived(audioGraph[changedColorNodeId]);
	let changedNodeColor: string | undefined = $state();

	const openChangeColorModal = (nodeId: string) => () => {
		changeColorModalIsOpen = true;
		changedColorNodeId = nodeId;
		changedNodeColor = audioGraph[nodeId]?.ui.primaryColor ?? '#000000';
		closeMenu();
	};

	const closeChangeColorModal = () => {
		changeColorModalIsOpen = false;
	};

	const handleColorChange = (color: string) => {
		changedNodeColor = color;
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
	let size = $state(project.size);

	const makeStuffSmaller = () => {
		size = size - 0.1;

		updatePlugPositions();

		onSizeChange(size);
	};

	const makeStuffBigger = () => {
		size = size + 0.1;

		updatePlugPositions();

		onSizeChange(size);
	};

	// COMMENTS ---------------------------------
	const handleCommentChanged = (e: { comment: string; nodeId: string }) => {
		const { nodeId, comment } = e;
		updateAudioGraphHistory((audioGraph) => changeComment(audioGraph, nodeId, comment));
	};

	const handleCanvasPointerDown = (event: PointerEvent) => {
		handleStartSelectingNodes(event);
		handleDragCanvasStart(event);
	};

	const handleCanvasPointerMove = (event: PointerEvent) => {
		handleSelectNodesDrag(event);
		handleDragCanvas(event);
	};
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class="canvas"
	onpointerdown={handleCanvasPointerDown}
	onpointermove={handleCanvasPointerMove}
	onmouseup={handleSelectNodesEnd}
	onpointerup={handleDragCanvasEnd}
	onclick={handleCanvasDoubleClick}
	onkeydown={() => {}}
	role="application"
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
		onClose={handleCloseProjectsModal}
		onNewProject={handleNewProject}
		onProjectChange={handleProjectChange}
		{onProjectDelete}
		{onProjectNameChange}
	/>
	<svg width="100vw" height="100vh">
		{#each linesToDisplay as line (line.key)}
			<Line
				{line}
				{chosenLine}
				onClick={handleLineClick(line)}
				onContextMenu={handleLineClick(line)}
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
		onpointerup={handleOpenContextMenu}
		oncontextmenu={(e) => e.preventDefault()}
		onpointermove={handleLineDrag}
		role="application"
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
					color={node.ui.primaryColor}
					{draggingLine}
					onDrag={handleDragNode}
					onDragStart={handleDragStart}
					onDragEnd={handleNodeDragEnd}
					onNodeParameterChangeStart={handleNodeParameterChangeStart}
					onNodeParamterChange={handleNodeParameterChange}
					onNodeParameterChangeEnd={handleNodeParameterChangeEnd}
					onNodePlugMouseDown={handlePlugDown}
					onNodePlugMouseUp={handlePlugUp}
					onNodeKnobMouseUp={handleKnobMouseUp}
					onContextMenu={handleNodeClick}
					onClick={handleSelectNodeClick(id)}
					onPlugCreated={handlePlugCreated}
					onKnobCreated={handleKnobCreated}
					onCommentChanged={handleCommentChanged}
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
			></div>
		{/if}
		{#if showMenu && menuKind === 'line'}
			<PositionedMenu position={menuPosition} onClose={closeMenu}>
				{#if chosenLineMultiply !== undefined}
					<MenuButton onClick={openLineMultiplyMenu}
						>Mult: {chosenLineMultiply.toFixed(2)}</MenuButton
					>
				{/if}
				<MenuButton onClick={handleDeleteConnection} variant="danger">Delete</MenuButton>
			</PositionedMenu>
		{/if}

		{#if showMenu && menuKind === 'node'}
			<PositionedMenu position={menuPosition} onClose={closeMenu}>
				{#if selectedNodeIds.some((id) => menuNodeId === id)}
					<div class="nodes-selected-header">{selectedNodeIds.length} nodes selected:</div>
				{/if}
				<MenuButton onClick={openChangeColorModal(menuNodeId)}>Color</MenuButton>
				<MenuButton onClick={handleCopyNode}>Copy</MenuButton>
				<MenuButton onClick={handleDeleteNode} variant="danger">Delete</MenuButton>
			</PositionedMenu>
		{/if}

		{#if showMenu && menuKind === 'canvas'}
			<ContextMenu
				position={menuPosition}
				onCreate={handleCreateElementClick}
				onPaste={handlePasteClick}
				onClose={closeMenu}
			/>
		{/if}

		{#if showMenu && menuKind === 'line-multiply'}
			<PositionedMenu position={menuPosition} onClose={closeMenu}>
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
					onChange={handleMultiplyValueChange}
					onMouseDown={handleMultiplyValueChangeStart}
					onMouseUp={handleEndMultiplyValueChange}
				/>
			</PositionedMenu>
		{/if}

		{#if changeColorModalIsOpen}
			<ChangeColorModal
				value={changedNodeColor}
				open
				onChange={handleColorChange}
				onConfirm={handleConfirmChange}
				onClose={closeChangeColorModal}
			>
				{#snippet node()}
					<div>
						{#if changedColorNode !== undefined}
							<Node
								color={changedNodeColor!}
								node={changedColorNode}
								id={changedColorNodeId}
								instantiatedNode={null}
								draggingLine={false}
								running={playing}
								{audioGraph}
							/>
						{/if}
					</div>
				{/snippet}
			</ChangeColorModal>
		{/if}
		<div class="beta-info">
			This app is in beta. Report bugs on our <a
				href="https://discord.com/channels/1270016157000400916/1270016157000400920"
				>Discord Server</a
			>.
		</div>
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

	.beta-info {
		position: absolute;
		bottom: 0;
		left: 0;
		font-size: 12px;
		background-color: var(--neutral-700);
	}
</style>
