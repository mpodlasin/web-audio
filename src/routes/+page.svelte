<script lang="ts">
	import {
		createAudioCanvas,
		type AudioNodeDatabase,
		playAudioCanvas,
		type SerializedAudioElements,
		allowedSerializedAudioElementStaticDefinitions,
		updateAudioCanvas
	} from '../audio/AudioCanvas';
	import { oscillatorGainDestination } from '../examples/oscillator-gain-desination';
	import { triggerEnvelopeOscillatorGainDestination } from '../examples/trigger-envelope-oscillator-gain-destination';
	import { sequencerEnvelopeOscillatorGainDestination } from '../examples/sequencer-envelope-oscillator-gain-destination';
	import { midiEnvelopeOscillatorGainDestination } from '../examples/midi-envelope-oscillator-gain-destination';
	import DraggableNode from '../components/DraggableNode.svelte';

	const audioGraphLocalStorageKey = 'audioGraph';

	let chosenExample = 'sequencer-envelope-oscillator-gain-destination';

	interface SerializedAudioElementsWithPositions {
		[key: string]: SerializedAudioElements[string] & {
			id: string;
			position: {
				x: number;
				y: number;
			};
		};
	}

	let audioNodeDatabase: AudioNodeDatabase = {};

	let audioGraph: SerializedAudioElements;
	let oldAudioGraph: SerializedAudioElements;
	$: {
		if (!audioGraph) {
			if (chosenExample === 'oscillator-gain-destination') {
				audioGraph = oscillatorGainDestination;
			} else if (chosenExample === 'trigger-envelope-oscillator-gain-destination') {
				audioGraph = triggerEnvelopeOscillatorGainDestination;
			} else if (chosenExample === 'sequencer-envelope-oscillator-gain-destination') {
				audioGraph = sequencerEnvelopeOscillatorGainDestination;
			} else if (chosenExample === 'midi-envelope-oscillator-gain-destination') {
				audioGraph = midiEnvelopeOscillatorGainDestination;
			}
			oldAudioGraph = audioGraph;

			audioNodeDatabase = {};

			createAudioCanvas(audioGraph, audioNodeDatabase);
		}
	}

	let audioGraphWithPositions: SerializedAudioElementsWithPositions = {};

	const audioGraphWithPositionFromLocalStorage = localStorage.getItem(audioGraphLocalStorageKey);

	if (audioGraphWithPositionFromLocalStorage) {
		audioGraphWithPositions = JSON.parse(audioGraphWithPositionFromLocalStorage);
	}

	$: {
		console.log('setting items in local storage');
		localStorage.setItem(audioGraphLocalStorageKey, JSON.stringify(audioGraphWithPositions));
	}

	$: {
		audioGraphWithPositions = Object.fromEntries(
			Object.entries(audioGraph).map(([key, value]) => [
				key,
				{
					...value,
					id: key,
					position: audioGraphWithPositions[key]?.position ?? {
						x: Math.random() * 1000,
						y: Math.random() * 800
					}
				}
			])
		);
	}

	const handlePlay = () => {
		playAudioCanvas(audioNodeDatabase);
	};

	$: lines = Object.values(audioGraphWithPositions).reduce(
		(acc: (readonly [readonly [string, string], readonly [string, string]])[], node) => {
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
								[node.id, staticToDefinition.inputs[0] as string]
							] as const;
						} else {
							return [
								[input.id, input.output],
								[node.id, staticToDefinition.inputs[0] as string]
							] as const;
						}
				  })
				: [];

			const mappedParams = node.parameters
				? Object.entries(node.parameters).flatMap(([key, value]) => {
						if (Array.isArray(value)) {
							return value.map((input) => {
								if (typeof input === 'string') {
									const staticNodeDefinition =
										allowedSerializedAudioElementStaticDefinitions[
											audioGraphWithPositions[input]!
												.type as keyof typeof allowedSerializedAudioElementStaticDefinitions
										];
									return [
										[input, staticNodeDefinition.outputs[0] as string],
										[node.id, key]
									] as const;
								} else {
									return [
										[input.id, input.output],
										[node.id, key]
									] as const;
								}
							});
						}

						return [];
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
			const oldX = node.position.x;
			const oldY = node.position.y;

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

			audioGraphWithPositions[id]!.position.x = x;
			audioGraphWithPositions[id]!.position.y = y;
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
		oldAudioGraph = JSON.parse(JSON.stringify(audioGraph));

		const { id, parameterName, value } = event.detail;

		audioGraph = {
			...audioGraph,
			[id]: {
				...audioGraph[id],
				parameters: {
					...audioGraph[id]!.parameters,
					[parameterName]: value
				}
			}
		} as any;
	};

	$: {
		updateAudioCanvas(audioGraph, oldAudioGraph, audioNodeDatabase);
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
		(element: keyof typeof allowedSerializedAudioElementStaticDefinitions) =>
		(event: MouseEvent) => {
			event.preventDefault();

			const idsSoFar = Object.keys(audioGraph);

			const nextId = Math.max(...idsSoFar.map((id) => parseInt(id, 10))) + 1;

			const staticNodeDefinition = allowedSerializedAudioElementStaticDefinitions[element];

			audioGraph = {
				...audioGraph,
				[nextId]: {
					type: element,
					inputs: [],
					outputs: [],
					parameters: Object.fromEntries(
						Object.entries(staticNodeDefinition.parameters).map(([key, value]) => [
							key,
							value.defaultValue
						])
					)
				}
			} as any;
		};
</script>

<div>
	<div class="menu">
		<label for="example">Chosen Example</label>
		<select id="example" bind:value={chosenExample}>
			<option value="oscillator-gain-destination">Oscillator Gain Destination</option>
			<option value="trigger-envelope-oscillator-gain-destination"
				>Trigger Envelope Oscillator Gain Destination</option
			>
			<option value="sequencer-envelope-oscillator-gain-destination"
				>Sequencer Envelope Oscillator Gain Destination</option
			>
			<option value="midi-envelope-oscillator-gain-destination"
				>Midi Envelope Oscillator Gain Destination</option
			>
		</select>
		<div>
			<label for="play">Play</label>
			<button id="play" on:click={handlePlay}>Play</button>
		</div>
	</div>
	<div
		class="audio-canvas"
		on:contextmenu={handleCanvasLeftClick}
		on:click={handleCanvasRightClick}
		on:keypress={() => {}}
	>
		{#each Object.values(audioGraphWithPositions) as node (node.id)}
			<DraggableNode
				id={node.id}
				{node}
				position={node.position}
				on:drag={handleDrag}
				on:nodePlugAndKnobPositions={handleNodePlugPositions}
				on:nodeParameterChange={handleNodeParameterChange}
			/>
		{/each}
		<svg width="100vw" height="100vh">
			{#each linesToDisplay as line}
				<line x1={line.from.x} y1={line.from.y} x2={line.to.x} y2={line.to.y} stroke="black" />
			{/each}
		</svg>

		{#if showMenu}
			<div class="create-node-menu" style="left: {menuPosition.x}px; top: {menuPosition.y}px;">
				<button on:click={handleCreateElementClick('oscillator')}>Oscillator</button>
				<button on:click={handleCreateElementClick('gain')}>Gain</button>
				<button on:click={handleCreateElementClick('trigger')}>Trigger</button>
				<button on:click={handleCreateElementClick('sequencer')}>Sequencer</button>
				<button on:click={handleCreateElementClick('midi')}>Midi</button>
				<button on:click={handleCreateElementClick('envelope')}>Envelope</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.menu {
		position: fixed;
		top: 8px;
		border: 1px solid black;
		padding: 16px;
	}

	.create-node-menu {
		position: absolute;
		border: 1px solid black;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
</style>
