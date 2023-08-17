<script lang="ts">
	import {
		createAudioCanvas,
		type AudioNodeDatabase,
		playAudioCanvas,
		type SerializedAudioElements
	} from '../audio/AudioCanvas';
	import { oscillatorGainDestination } from '../examples/oscillator-gain-desination';
	import { triggerEnvelopeOscillatorGainDestination } from '../examples/trigger-envelope-oscillator-gain-destination';
	import { sequencerEnvelopeOscillatorGainDestination } from '../examples/sequencer-envelope-oscillator-gain-destination';
	import { midiEnvelopeOscillatorGainDestination } from '../examples/midi-envelope-oscillator-gain-destination';
	import Node from '../components/Node.svelte';

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

	let text: string;
	$: if (chosenExample === 'oscillator-gain-destination') {
		text = JSON.stringify(oscillatorGainDestination, null, 2);
	} else if (chosenExample === 'trigger-envelope-oscillator-gain-destination') {
		text = JSON.stringify(triggerEnvelopeOscillatorGainDestination, null, 2);
	} else if (chosenExample === 'sequencer-envelope-oscillator-gain-destination') {
		text = JSON.stringify(sequencerEnvelopeOscillatorGainDestination, null, 2);
	} else if (chosenExample === 'midi-envelope-oscillator-gain-destination') {
		text = JSON.stringify(midiEnvelopeOscillatorGainDestination, null, 2);
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
</script>

<div>
	<h2>Page</h2>
	<div>
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
	</div>
	<div class="audio-canvas">
		{#each Object.values(audioGraphWithPositions) as node (node.id)}
			<Node id={node.id} {node} position={node.position} on:drag={handleDrag} />
		{/each}

		positions:
		{#each Object.values(audioGraphWithPositions) as node (node.id)}
			{node.type} {node.position.x}, {node.position.y}
		{/each}
	</div>
	<div>
		<label for="play">Play</label>
		<button id="play" on:click={handlePlay}>Play</button>
	</div>
</div>

<style>
	.audio-canvas {
		width: 100%;
		height: 80vh;
		border: 1px solid black;
	}
</style>
