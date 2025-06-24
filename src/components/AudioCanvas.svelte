<script lang="ts">
	import { onMount } from 'svelte';
	import {
		allowedSerializedAudioElementStaticDefinitions,
		type Plug,
		type Position,
		type SerializedAudioElements
	} from '../audio/serialized';
	import type { Project } from '../ui/project';
	import PlugPositions from './AudioCanvas/plugPositions.svelte';
	import { Projects } from './AudioCanvas/projects.svelte';
	import ProjectHeader from './ProjectHeader.svelte';
	import ProjectsModal from './ProjectsModal.svelte';
	import { Menus } from './AudioCanvas/menus.svelte';
	import DraggingCanvas from './AudioCanvas/draggingCanvas.svelte';
	import { Resize } from './AudioCanvas/resize.svelte';
	import { LineDragging } from './AudioCanvas/lineDragging.svelte';
	import { AudioGraph } from './AudioCanvas/audioGraph.svelte';
	import PositionedMenu from './PositionedMenu.svelte';
	import MenuButton from './MenuButton.svelte';
	import ContextMenu from './ContextMenu.svelte';
	import Knob from './Knob.svelte';
	import DraggingNodes from './AudioCanvas/draggingNodes.svelte';
	import { NodeParameterChange } from './AudioCanvas/nodeParameterChange.svelte';
	import { AddRemoveNodes } from './AudioCanvas/addRemoveNodes.svelte';
	import { getLinesToDisplay } from '../ui/lines';
	import { Playing } from './AudioCanvas/playing.svelte';
	import Line from './Line.svelte';
	import DraggableNode from './DraggableNode.svelte';
	import DraggingLine from './DraggingLine.svelte';
	import PlugMask from './PlugMask.svelte';
	import KnobMask from './KnobMask.svelte';

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

	const projects = new Projects(tutorialMode, onNewProject, onProjectChange);

	const audioGraph = new AudioGraph(project.audioCanvas, onChange);

	const plugPositions = new PlugPositions(audioGraph);

	const resize = new Resize(project.size, plugPositions, onSizeChange);

	const draggingCanvas = new DraggingCanvas(
		project.canvasRelativePosition,
		resize,
		onCanvasRelativePositionChange,
		plugPositions
	);

	const lineDragging = new LineDragging(plugPositions, audioGraph);

	const menus = new Menus(draggingCanvas, lineDragging, audioGraph, plugPositions);

	const draggingNodes = new DraggingNodes(audioGraph, plugPositions, draggingCanvas);

	const nodeParameterChange = new NodeParameterChange(audioGraph);

	const addRemoveNodes = new AddRemoveNodes(audioGraph, draggingCanvas, menus, plugPositions);

	let linesToDisplay = $derived(
		getLinesToDisplay(audioGraph.audioGraph, plugPositions.plugPositions)
	);

	const playing = new Playing();

	window.addEventListener('keydown', (event) => {
		if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
			audioGraph.undo();
		}
	});

	const handleCommentChanged = (event: { comment: string; nodeId: string }) => {
		audioGraph.changeComment(event.nodeId, event.comment);
	};

	onMount(() => {
		plugPositions.updatePlugPositions();
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class="canvas"
	onpointerdown={draggingCanvas.handleDragCanvasStart}
	onpointermove={draggingCanvas.handleDragCanvas}
	onpointerup={draggingCanvas.handleDragCanvasEnd}
	onkeydown={() => {}}
	role="application"
>
	<ProjectHeader
		projectName={chosenProjectName}
		playing={playing.playing}
		onProjectNameClick={projects.handleProjectNameClick}
		onPlayChange={playing.handlePlayChange}
		onMakeStuffBigger={resize.makeStuffBigger}
		onMakeStuffSmaller={resize.makeStuffSmaller}
	/>
	<ProjectsModal
		open={projects.showProjectsModal}
		projects={projectNames}
		onClose={projects.handleCloseProjectsModal}
		onNewProject={projects.handleNewProject}
		onProjectChange={projects.handleProjectChange}
		{onProjectDelete}
		{onProjectNameChange}
	/>
	<svg width="100vw" height="100vh">
		{#each linesToDisplay as line (line.key)}
			<Line
				{line}
				chosenLine={menus.chosenLine}
				onClick={menus.handleLineClick(line)}
				onContextMenu={menus.handleLineClick(line)}
			/>
		{/each}
		<DraggingLine
			startPosition={lineDragging.positionOfStartingPlug}
			endPosition={lineDragging.positionOfEndPlug ?? { x: 0, y: 0 }}
			visible={!!(lineDragging.draggingLine && lineDragging.positionOfEndPlug)}
		/>
	</svg>
	<div
		class="audio-canvas"
		onpointerup={menus.handleOpenContextMenu}
		onpointermove={lineDragging.handleLineDrag}
		oncontextmenu={(e) => e.preventDefault()}
		role="application"
	>
		<div
			class="nodes"
			style="transform: translate({draggingCanvas.canvasRelativePosition.x}px, {draggingCanvas
				.canvasRelativePosition.y}px) scale({resize.size});"
		>
			{#each Object.entries(audioGraph.audioGraph) as [id, node], index (id)}
				<DraggableNode
					{id}
					{node}
					order={index}
					audioGraph={audioGraph.audioGraph}
					running={playing.playing}
					selected={false}
					instantiatedNode={audioGraph.audioNodeDatabase[id]}
					hoveringOverPlug={plugPositions.hoveringOverPlug}
					position={{ x: node.ui?.position.x ?? 0, y: node.ui?.position.y ?? 0 }}
					color={node.ui.primaryColor}
					draggingLine={lineDragging.draggingLine}
					onDrag={draggingNodes.handleDragNode}
					onDragStart={draggingNodes.handleDragStart}
					onDragEnd={draggingNodes.handleNodeDragEnd}
					onNodeParameterChangeStart={nodeParameterChange.handleNodeParameterChangeStart}
					onNodeParamterChange={nodeParameterChange.handleNodeParameterChange}
					onNodeParameterChangeEnd={nodeParameterChange.handleNodeParameterChangeEnd}
					onNodePlugMouseDown={lineDragging.handlePlugDown}
					onNodePlugMouseUp={lineDragging.handlePlugUp}
					onNodeKnobMouseUp={lineDragging.handleKnobMouseUp}
					onContextMenu={menus.handleNodeClick}
					onClick={() => {}}
					onPlugCreated={plugPositions.andlePlugCreated}
					onKnobCreated={plugPositions.handleKnobCreated}
					onCommentChanged={handleCommentChanged}
					onNodeCreated={plugPositions.handleNodeCreated}
				/>
			{/each}
		</div>
		{#if menus.showMenu && menus.menuKind === 'line'}
			<PositionedMenu position={menus.menuPosition} onClose={menus.closeMenu}>
				{#if menus.chosenLineMultiply !== undefined}
					<MenuButton onClick={menus.openLineMultiplyMenu}
						>Mult: {menus.chosenLineMultiply.toFixed(2)}</MenuButton
					>
				{/if}
				<MenuButton onClick={menus.handleDeleteConnection} variant="danger">Delete</MenuButton>
			</PositionedMenu>
		{/if}

		{#if menus.showMenu && menus.menuKind === 'node'}
			<PositionedMenu position={menus.menuPosition} onClose={menus.closeMenu}>
				<MenuButton onClick={menus.handleCopyNode}>Copy</MenuButton>
				<MenuButton onClick={addRemoveNodes.handleDeleteNode} variant="danger">Delete</MenuButton>
			</PositionedMenu>
		{/if}

		{#if menus.showMenu && menus.menuKind === 'canvas'}
			<ContextMenu
				position={menus.menuPosition}
				onCreate={addRemoveNodes.handleCreateElementClick}
				onPaste={addRemoveNodes.handlePasteClick}
				onClose={menus.closeMenu}
			/>
		{/if}

		{#if menus.showMenu && menus.menuKind === 'line-multiply'}
			<PositionedMenu position={menus.menuPosition} onClose={menus.closeMenu}>
				<Knob
					nodeOrder={0}
					parameterName="mult"
					parameter={{ base: menus.chosenLineMultiply ?? 1, inputs: [] }}
					defaultValue={1}
					minValue={0}
					maxValue={10_000}
					polarity="uni"
					draggingLine={false}
					audioParamAnalyser={undefined}
					nodeId=""
					onChange={menus.handleMultiplyValueChange}
					onMouseDown={menus.handleMultiplyValueChangeStart}
					onMouseUp={menus.handleEndMultiplyValueChange}
				/>
			</PositionedMenu>
		{/if}
		<div class="beta-info">
			This app is in beta. Report bugs on our <a
				href="https://discord.com/channels/1270016157000400916/1270016157000400920"
				>Discord Server</a
			>.
		</div>
	</div>
	<div class="plug-masks">
		{#each plugPositions.plugMasks as mask (mask.nodeId + ' - ' + mask.plugId + ' - ' + mask.type)}
			<PlugMask
				{...mask}
				draggingLine={lineDragging.draggingLine || draggingNodes.draggingNodes}
				onPointerDown={lineDragging.handlePlugDown}
				onPointerUp={lineDragging.handlePlugUp}
				onHoveringOver={plugPositions.handleHoveringOverPlugMask}
				onPointerMove={lineDragging.handleLineDrag}
			></PlugMask>
		{/each}
	</div>
	<div class="knob-masks">
		{#each plugPositions.knobMasksWithData as mask (mask.nodeId + ' - ' + mask.parameterName)}
			<KnobMask
				{...mask}
				draggingLine={lineDragging.draggingLine || draggingNodes.draggingNodes}
				onMouseDown={nodeParameterChange.handleNodeParameterChangeStart}
				onChange={nodeParameterChange.handleNodeParameterChange}
				onMouseUp={nodeParameterChange.handleNodeParameterChangeEnd}
			/>
		{/each}
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
		z-index: 1;
		position: absolute;
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
