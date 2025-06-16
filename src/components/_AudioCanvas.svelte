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

	let copiedNodes: string[] = [];

	/* UNDO ----------------------------------------- */
	const handleCanvasKeypress = (event: KeyboardEvent) => {
		if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
			undo();
		}
	};
	window.addEventListener('keydown', handleCanvasKeypress);

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
