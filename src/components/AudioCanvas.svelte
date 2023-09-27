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
		plugsEqual
	} from '../audio/AudioCanvas';
	import DraggableNode from '../components/DraggableNode.svelte';
	import Menu from './Menu.svelte';
	import Button from './Button.svelte';
	import ProjectHeader from './ProjectHeader.svelte';
	import { getLinesToDisplay } from '../ui/lines';
	import { addDiff, addDiffToAllPositions, type PlugPositions } from '../ui/plugPositions';
	import ProjectsModal from './ProjectsModal.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Project } from '../ui/project';

	export let chosenProjectName: string;
	export let projectNames: string[];
	export let project: Project;

	let initialAudioCanvas = project.audioCanvas;

	let audioNodeDatabase: AudioNodeDatabase = {};

	let audioGraphHistory: SerializedAudioElements[] = [{}, initialAudioCanvas];
	let dragStartPosition: { x: number; y: number } | null = null;

	const handleDragCanvasStart = (event: MouseEvent) => {
		dragStartPosition = {
			x: event.clientX,
			y: event.clientY
		};
	};

	const handleDragCanvasEnd = () => {
		dragStartPosition = null;
	};

	const handleDragCanvas = (event: MouseEvent) => {
		if (!dragStartPosition) return;

		const positionChange = {
			x: dragStartPosition.x - event.clientX,
			y: dragStartPosition.y - event.clientY
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

		dragStartPosition = {
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

	let plugPositions: PlugPositions = {};

	const handleDragNode = (event: CustomEvent<{ x: number; y: number; id: string }>) => {
		const { x, y, id } = event.detail;
		const node = audioGraphWithPositions[id];

		if (node) {
			const oldX = node.ui?.position.x ?? 0;
			const oldY = node.ui?.position.y ?? 0;

			const diffX = x - oldX;
			const diffY = y - oldY;

			const prevPositions = plugPositions[id];

			if (!prevPositions) return;

			plugPositions[id] = addDiff(prevPositions, diffX, diffY);

			if (audioGraphHistory.length >= 2) {
				audioGraphHistory = [
					...audioGraphHistory,
					{
						...audioGraphHistory.at(-1),
						[id]: {
							...(audioGraphHistory.at(-1)?.[id] as any),
							ui: {
								position: {
									x,
									y
								}
							}
						}
					}
				];
			} else {
				const onlyElement = audioGraphHistory[0];

				if (onlyElement) {
					audioGraphHistory = [
						onlyElement,
						{
							...onlyElement,
							[id]: {
								...(onlyElement[id] as any),
								ui: {
									position: {
										x,
										y
									}
								}
							}
						}
					];
				}
			}
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

	const handleCreateElementClick =
		(type: keyof typeof allowedSerializedAudioElementStaticDefinitions) => (event: MouseEvent) => {
			event.preventDefault();

			audioGraphHistory = [
				...audioGraphHistory,
				addNode(audioGraphWithPositions, type, menuPosition)
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

		window.addEventListener('mouseup', stopDragging);
	};

	const stopDragging = () => {
		draggingLine = false;

		window.removeEventListener('mouseup', stopDragging);
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

	const handleDeleteNode = () => {
		audioGraphHistory = [...audioGraphHistory, removeNode(audioGraphWithPositions, menuNodeId)];
	};

	let playing = false;

	const handlePlayChange = (event: CustomEvent<{ playing: boolean }>) => {
		playing = event.detail.playing;
	};

	$: {
		if (playing) {
			playAudioCanvas(audioNodeDatabase);
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

		window.addEventListener('click', closeMenu);
	};

	const handleLineLeftClick = (fromPlug: Plug, toPlug: Plug) => (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();

		showMenu = true;
		menuKind = 'line';
		lineMenuPlugs = [fromPlug, toPlug];
		menuPosition = { x: event.clientX, y: event.clientY };

		window.addEventListener('click', closeMenu);
	};

	const handleNodeLeftClick = (nodeId: string) => (event: MouseEvent) => {
		event.preventDefault();

		menuPosition = { x: event.clientX, y: event.clientY };
		showMenu = true;
		menuKind = 'node';
		lineMenuPlugs = null;
		menuNodeId = nodeId;

		window.addEventListener('click', closeMenu);
	};

	const closeMenu = () => {
		showMenu = false;
		lineMenuPlugs = null;

		window.removeEventListener('click', closeMenu);
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
				instantiatedNode={audioNodeDatabase[id]}
				position={node.ui?.position ?? { x: 0, y: 0 }}
				on:drag={handleDragNode}
				on:nodePlugAndKnobPositions={handleNodePlugPositions}
				on:nodeParameterChange={handleNodeParameterChange}
				on:nodePlugClick={handlePlugClick}
				on:nodePlugUp={handlePlugUp}
				on:deleteNode={handleDeleteNode}
				on:knobMouseUp={handleKnobMouseUp}
				on:contextmenu={handleNodeLeftClick(id)}
			/>
		{/each}
		<svg width="100vw" height="100vh">
			{#each linesToDisplay as line}
				<line x1={line.from.x} y1={line.from.y} x2={line.to.x} y2={line.to.y} class="visible" />
				<line
					on:contextmenu={handleLineLeftClick(line.line[0], line.line[1])}
					x1={line.from.x}
					y1={line.from.y}
					x2={line.to.x}
					y2={line.to.y}
					stroke="transparent"
					stroke-width="7"
					stroke-linecap="round"
					class="invisible"
					class:chosen={lineMenuPlugs
						? plugsEqual(lineMenuPlugs[0], line.line[0]) &&
						  plugsEqual(lineMenuPlugs[1], line.line[1])
						: false}
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
					<Button on:click={handleDeleteConnection} title="Delete" variant="danger" />
				</Menu>
			</div>
		{/if}

		{#if showMenu && menuKind === 'node'}
			<div class="create-node-menu" style="left: {menuPosition.x}px; top: {menuPosition.y}px;">
				<Menu>
					<Button on:click={handleDeleteNode} title="Delete" variant="danger" />
				</Menu>
			</div>
		{/if}

		{#if showMenu && menuKind === 'canvas'}
			<div class="create-node-menu" style="left: {menuPosition.x}px; top: {menuPosition.y}px;">
				<Menu>
					<Button on:click={handleCreateElementClick('oscillator')} title="Oscillator" />
					<Button on:click={handleCreateElementClick('gain')} title="Gain" />
					<Button on:click={handleCreateElementClick('trigger')} title="Trigger" />
					<Button on:click={handleCreateElementClick('sequencer')} title="Sequencer" />
					<Button on:click={handleCreateElementClick('midi')} title="MIDI" />
					<Button on:click={handleCreateElementClick('envelope')} title="Envelope" />
					<Button on:click={handleCreateElementClick('oscilloscope')} title="Oscilloscope" />
					<Button on:click={handleCreateElementClick('destination')} title="Destination" />
				</Menu>
			</div>
		{/if}
	</div>
</div>

<style>
	.canvas {
		background-color: var(--neutral-700);
	}

	.create-node-menu {
		position: absolute;
	}

	svg {
		position: relative;
		pointer-events: none;
	}

	line {
		pointer-events: all;
	}

	line.visible {
		stroke: var(--neutral-300);
	}

	line.invisible {
		transition: stroke 0.2s;
		opacity: 0.5;
	}

	line.invisible:hover,
	line.chosen {
		stroke: var(--primary-500);
	}
</style>
