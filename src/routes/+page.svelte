<script lang="ts">
	import {
		createAudioCanvas,
		type AudioNodeDatabase,
		playAudioCanvas,
		type SerializedAudioElements,
		allowedSerializedAudioElementStaticDefinitions
	} from '../audio/AudioCanvas';
	import { oscillatorGainDestination } from '../examples/oscillator-gain-desination';
	import { triggerEnvelopeOscillatorGainDestination } from '../examples/trigger-envelope-oscillator-gain-destination';
	import { sequencerEnvelopeOscillatorGainDestination } from '../examples/sequencer-envelope-oscillator-gain-destination';
	import { midiEnvelopeOscillatorGainDestination } from '../examples/midi-envelope-oscillator-gain-destination';
	import DraggableNode from '../components/DraggableNode.svelte';

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
	$: {
		if (chosenExample === 'oscillator-gain-destination') {
			audioGraph = oscillatorGainDestination;
		} else if (chosenExample === 'trigger-envelope-oscillator-gain-destination') {
			audioGraph = triggerEnvelopeOscillatorGainDestination;
		} else if (chosenExample === 'sequencer-envelope-oscillator-gain-destination') {
			audioGraph = sequencerEnvelopeOscillatorGainDestination;
		} else if (chosenExample === 'midi-envelope-oscillator-gain-destination') {
			audioGraph = midiEnvelopeOscillatorGainDestination;
		}

		audioNodeDatabase = {};

		createAudioCanvas(audioGraph, audioNodeDatabase);
	}
	let audioGraphWithPositions: SerializedAudioElementsWithPositions;

	$: {
		const audioGraphWithPositionsFromLocalStorage = localStorage.getItem('audioGraphWithPositions');

		if (audioGraphWithPositionsFromLocalStorage !== null) {
			audioGraphWithPositions = JSON.parse(audioGraphWithPositionsFromLocalStorage);
		} else {
			audioGraphWithPositions = {
				...Object.entries(audioGraph).reduce(
					(acc: SerializedAudioElementsWithPositions, [key, value]) => {
						acc[key] = {
							id: key,
							...value,
							position: {
								x: 0,
								y: 0
							}
						};

						return acc;
					},
					{}
				)
			};
		}
	}

	const handlePlay = () => {
		playAudioCanvas(audioNodeDatabase);
	};

	const handleDrag = (event: CustomEvent<{ x: number; y: number; id: string }>) => {
		const { x, y, id } = event.detail;

		if (audioGraphWithPositions[id]) {
			audioGraphWithPositions[id]!.position.x = x;
			audioGraphWithPositions[id]!.position.y = y;
		}
	};

	$: {
		localStorage.setItem('audioGraphWithPositions', JSON.stringify(audioGraphWithPositions));
	}

	$: lines = Object.values(audioGraphWithPositions).reduce(
		(acc: (readonly [readonly [string, string], string])[], node) => {
			if (node.inputs) {
				const mapped = node.inputs.map((input) => {
					if (typeof input === 'string') {
						const staticNodeDefinition =
							allowedSerializedAudioElementStaticDefinitions[
								audioGraphWithPositions[input]!
									.type as keyof typeof allowedSerializedAudioElementStaticDefinitions
							];
						return [[input, staticNodeDefinition.outputs[0] as string], node.id] as const;
					} else {
						return [[input.id, input.output], node.id] as const;
					}
				});

				return [...mapped, ...acc];
			}

			return acc;
		},
		[]
	);

	let plugPositions: {
		[key: string]: {
			inputPlugPositions: { [key: string]: { x: number; y: number } };
			outputPlugPositions: { [key: string]: { x: number; y: number } };
		};
	} = {};

	const handleNodePlugPositions = (event: CustomEvent) => {
		const { id, inputPlugPositions, outputPlugPositions } = event.detail;

		plugPositions[id] = {
			inputPlugPositions,
			outputPlugPositions
		};
	};

	$: linesToDisplay = lines.flatMap(([from, to]) => {
		const [fromId, fromName] = from;

		const fromNode = audioGraphWithPositions[fromId];
		const toNode = audioGraphWithPositions[to];

		if (!fromNode || !toNode) {
			return [];
		}

		const fromStaticNodeDefinition =
			allowedSerializedAudioElementStaticDefinitions[
				fromNode.type as keyof typeof allowedSerializedAudioElementStaticDefinitions
			];
		const toStaticNodeDefinition =
			allowedSerializedAudioElementStaticDefinitions[
				toNode.type as keyof typeof allowedSerializedAudioElementStaticDefinitions
			];
		const fromPlugPosition = plugPositions[fromId]?.outputPlugPositions[fromName];
		const toPlugPosition =
			plugPositions[to]?.inputPlugPositions[toStaticNodeDefinition.inputs[0] as string];

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

	$: {
		console.log(plugPositions);
		console.log(lines);
	}
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
	<div class="audio-canvas">
		{#each Object.values(audioGraphWithPositions) as node (node.id)}
			<DraggableNode
				id={node.id}
				{node}
				position={node.position}
				on:drag={handleDrag}
				on:nodePlugPositions={handleNodePlugPositions}
			/>
		{/each}
		<svg width="100vh" height="100vh">
			{#each linesToDisplay as line}
				<line x1={line.from.x} y1={line.from.y} x2={line.to.x} y2={line.to.y} stroke="black" />
			{/each}
		</svg>
	</div>
</div>

<style>
	.menu {
		position: fixed;
		top: 8px;
		border: 1px solid black;
		padding: 16px;
	}
</style>
