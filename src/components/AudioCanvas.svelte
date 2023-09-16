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
		addConnectionToParameter
	} from '../audio/AudioCanvas';
	import { oscillatorGainDestination } from '../examples/oscillator-gain-desination';
	import { triggerEnvelopeOscillatorGainDestination } from '../examples/trigger-envelope-oscillator-gain-destination';
	import { sequencerEnvelopeOscillatorGainDestination } from '../examples/sequencer-envelope-oscillator-gain-destination';
	import { midiEnvelopeOscillatorGainDestination } from '../examples/midi-envelope-oscillator-gain-destination';
	import DraggableNode from '../components/DraggableNode.svelte';
	import Menu from './Menu.svelte';
	import Button from './Button.svelte';
	import ProjectHeader from './ProjectHeader.svelte';

	const audioGraphLocalStorageKey = 'audioGraph';

	let chosenExample = 'empty';

	const addRandomPositions = (audioGraph: SerializedAudioElements): SerializedAudioElements => {
		const audioGraphWithPositions: SerializedAudioElements = {};

		for (const [key, value] of Object.entries(audioGraph)) {
			audioGraphWithPositions[key] = {
				...value,
				ui: {
					position: {
						x: Math.random() * 1000,
						y: Math.random() * 1000
					}
				}
			};
		}

		return audioGraphWithPositions;
	};

	let audioNodeDatabase: AudioNodeDatabase = {};

	let audioGraphHistory: SerializedAudioElements[] = [];

	$: {
		if (audioGraphHistory.length === 0) {
			const audioGraphWithPositionFromLocalStorage =
				localStorage.getItem(audioGraphLocalStorageKey);

			if (audioGraphWithPositionFromLocalStorage) {
				const audioGraphWithPositions = JSON.parse(audioGraphWithPositionFromLocalStorage);
				audioGraphHistory = [audioGraphWithPositions];
			} else {
				switch (chosenExample) {
					case 'empty':
						audioGraphHistory = [{}, {}];
						break;
					case 'oscillator-gain-destination':
						audioGraphHistory = [{}, addRandomPositions(oscillatorGainDestination)];
						break;
					case 'trigger-envelope-oscillator-gain-destination':
						audioGraphHistory = [{}, addRandomPositions(triggerEnvelopeOscillatorGainDestination)];
						break;
					case 'sequencer-envelope-oscillator-gain-destination':
						audioGraphHistory = [
							{},
							addRandomPositions(sequencerEnvelopeOscillatorGainDestination)
						];
						break;
					case 'midi-envelope-oscillator-gain-destination':
						audioGraphHistory = [{}, addRandomPositions(midiEnvelopeOscillatorGainDestination)];
						break;
				}
			}
		}
	}

	$: previousAudioGraphWithPositions = audioGraphHistory.at(-2) ?? {};
	$: audioGraphWithPositions = audioGraphHistory.at(-1) ?? {};

	$: {
		localStorage.setItem(audioGraphLocalStorageKey, JSON.stringify(audioGraphWithPositions));
	}

	$: lines = Object.entries(audioGraphWithPositions).reduce(
		(acc: (readonly [readonly [string, string], readonly [string, string]])[], [id, node]) => {
			const staticToDefinition = allowedSerializedAudioElementStaticDefinitions[node.type];

			const mapped = node.inputs
				? node.inputs.map((input) => {
						if (typeof input === 'string') {
							const staticNodeDefinition =
								allowedSerializedAudioElementStaticDefinitions[
									audioGraphWithPositions[input]!
										.type as keyof typeof allowedSerializedAudioElementStaticDefinitions
								];
							return [
								[input, staticNodeDefinition.outputs[0] as string],
								[id, staticToDefinition.inputs[0] as string]
							] as const;
						} else {
							return [
								[input.id, input.output],
								[id, staticToDefinition.inputs[0] as string]
							] as const;
						}
				  })
				: [];

			const mappedParams = node.parameters
				? Object.entries(node.parameters).flatMap(([key, value]) => {
						return value.inputs.map((input) => {
							return [
								[input.id, input.output],
								[id, key]
							] as const;
						});
				  })
				: [];

			return [...mapped, ...mappedParams, ...acc];
		},
		[]
	);

	let plugPositions: {
		[key: string]: {
			inputPlugPositions: { [key: string]: { x: number; y: number } };
			outputPlugPositions: { [key: string]: { x: number; y: number } };
			parameterKnobPositions: { [key: string]: { x: number; y: number } };
		};
	} = {};

	const handleDrag = (event: CustomEvent<{ x: number; y: number; id: string }>) => {
		const { x, y, id } = event.detail;
		const node = audioGraphWithPositions[id];

		if (node) {
			const oldX = node.ui?.position.x ?? 0;
			const oldY = node.ui?.position.y ?? 0;

			const diffX = x - oldX;
			const diffY = y - oldY;

			plugPositions[id] = {
				inputPlugPositions: Object.fromEntries(
					Object.entries(plugPositions[id]?.inputPlugPositions ?? {}).map(([key, { x, y }]) => [
						key,
						{ x: x + diffX, y: y + diffY }
					])
				),
				outputPlugPositions: Object.fromEntries(
					Object.entries(plugPositions[id]?.outputPlugPositions ?? {}).map(([key, { x, y }]) => [
						key,
						{ x: x + diffX, y: y + diffY }
					])
				),
				parameterKnobPositions: Object.fromEntries(
					Object.entries(plugPositions[id]?.parameterKnobPositions ?? {}).map(([key, { x, y }]) => [
						key,
						{ x: x + diffX, y: y + diffY }
					])
				)
			};

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

	$: linesToDisplay = lines.flatMap(([from, to]) => {
		const [fromId, fromName] = from;
		const [toId, toName] = to;

		const fromNode = audioGraphWithPositions[fromId];
		const toNode = audioGraphWithPositions[toId];

		if (!fromNode || !toNode) {
			return [];
		}

		const toStaticNodeDefinition =
			allowedSerializedAudioElementStaticDefinitions[
				toNode.type as keyof typeof allowedSerializedAudioElementStaticDefinitions
			];
		const fromPlugPosition = plugPositions[fromId]?.outputPlugPositions[fromName];
		const toPlugPosition =
			plugPositions[toId]?.inputPlugPositions[toStaticNodeDefinition.inputs[0] as string];
		const toParameterKnobPosition = plugPositions[toId]?.parameterKnobPositions[toName];

		if (fromPlugPosition && toParameterKnobPosition) {
			return [
				{
					line: [
						{
							nodeId: fromId,
							type: 'output',
							id: fromName
						},
						{
							nodeId: toId,
							type: 'input',
							id: toName
						}
					] as const,
					from: {
						x: fromPlugPosition.x,
						y: fromPlugPosition.y
					},
					to: {
						x: toParameterKnobPosition.x,
						y: toParameterKnobPosition.y
					}
				}
			];
		}

		if (fromPlugPosition && toPlugPosition) {
			return [
				{
					line: [
						{
							nodeId: fromId,
							type: 'output',
							id: fromName
						},
						{
							nodeId: toId,
							type: 'input',
							id: toName
						}
					] as const,
					from: {
						x: fromPlugPosition.x,
						y: fromPlugPosition.y
					},
					to: {
						x: toPlugPosition.x,
						y: toPlugPosition.y
					}
				}
			];
		}

		return [];
	});

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

	let menuPosition = { x: 0, y: 0 };
	let showMenu = false;

	const handleCanvasLeftClick = (event: MouseEvent) => {
		event.preventDefault();

		menuPosition = { x: event.clientX, y: event.clientY };
		showMenu = true;
	};

	const handleCanvasRightClick = (event: MouseEvent) => {
		event.preventDefault();

		showMenu = false;
	};

	const handleCreateElementClick =
		(type: keyof typeof allowedSerializedAudioElementStaticDefinitions) => (event: MouseEvent) => {
			event.preventDefault();

			audioGraphHistory = [...audioGraphHistory, addNode(audioGraphWithPositions, type)];
		};

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

		draggingLine = false;
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

		draggingLine = false;
	};

	const handleLineDrag = (event: MouseEvent) => {
		event.preventDefault();

		positionOfEndPlug = { x: event.clientX, y: event.clientY };
	};

	let showLineMenu = false;
	let lineMenuPlugs: [Plug, Plug] | null = null;
	let lineMenuPosition = { x: 0, y: 0 };

	const handleLineLeftClick = (fromPlug: Plug, toPlug: Plug) => (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();

		showLineMenu = true;
		lineMenuPlugs = [fromPlug, toPlug];
		lineMenuPosition = { x: event.clientX, y: event.clientY };
	};

	const handleDeleteConnection = () => {
		if (!lineMenuPlugs) return;

		audioGraphHistory = [
			...audioGraphHistory,
			removeConnection(audioGraphWithPositions, lineMenuPlugs[0], lineMenuPlugs[1])
		];

		showLineMenu = false;
	};

	const handleDeleteNode = (event: CustomEvent<{ id: string }>) => {
		audioGraphHistory = [
			...audioGraphHistory,
			removeNode(audioGraphWithPositions, event.detail.id)
		];
	};

	let playing = false;

	const handlePlayChange = (event: CustomEvent<{ playing: boolean }>) => {
		console.log('play chaaaange');
		playing = event.detail.playing;
	};

	$: {
		if (playing) {
			playAudioCanvas(audioNodeDatabase);
		}
	}
</script>

<div class="canvas">
	<ProjectHeader projectName="Project 1" {playing} on:playChange={handlePlayChange} />
	<div
		class="audio-canvas"
		on:contextmenu={handleCanvasLeftClick}
		on:click={handleCanvasRightClick}
		on:keypress={() => {}}
		on:mousemove={handleLineDrag}
	>
		{#each Object.entries(audioGraphWithPositions) as [id, node] (id)}
			<DraggableNode
				{id}
				{node}
				instantiatedNode={audioNodeDatabase[id]}
				position={node.ui?.position ?? { x: 0, y: 0 }}
				on:drag={handleDrag}
				on:nodePlugAndKnobPositions={handleNodePlugPositions}
				on:nodeParameterChange={handleNodeParameterChange}
				on:nodePlugClick={handlePlugClick}
				on:nodePlugUp={handlePlugUp}
				on:deleteNode={handleDeleteNode}
				on:knobMouseUp={handleKnobMouseUp}
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
					stroke-width="10"
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

		{#if showLineMenu}
			<div
				class="create-node-menu"
				style="left: {lineMenuPosition.x}px; top: {lineMenuPosition.y}px;"
			>
				<Menu>
					<Button on:click={handleDeleteConnection} title="Delete" variant="danger" />
				</Menu>
			</div>
		{/if}

		{#if showMenu}
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
</style>
