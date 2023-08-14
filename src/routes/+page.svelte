<script lang="ts">
	import { createAudioCanvas, type AudioNodeDatabase, playAudioCanvas } from '../audio/AudioCanvas';
	import { oscillatorGainDestination } from '../examples/oscillator-gain-desination';
	import { triggerEnvelopeOscillatorGainDestination } from '../examples/trigger-envelope-oscillator-gain-destination';
	import { sequencerEnvelopeOscillatorGainDestination } from '../examples/sequencer-envelope-oscillator-gain-destination';
	import { midiEnvelopeOscillatorGainDestination } from '../examples/midi-envelope-oscillator-gain-destination';

	let chosenExample = 'sequencer-envelope-oscillator-gain-destination'

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

	$: {
		let exampleObject: any;
		if (chosenExample === 'oscillator-gain-destination') {
			exampleObject = oscillatorGainDestination;
		} else if (chosenExample === 'trigger-envelope-oscillator-gain-destination') {
			exampleObject = triggerEnvelopeOscillatorGainDestination;
		} else if (chosenExample === 'sequencer-envelope-oscillator-gain-destination') {
			exampleObject = sequencerEnvelopeOscillatorGainDestination;
		} else if (chosenExample === 'midi-envelope-oscillator-gain-destination') {
			exampleObject = midiEnvelopeOscillatorGainDestination;
		}

		audioNodeDatabase = {};

		createAudioCanvas(exampleObject, audioNodeDatabase);
	}

	const handlePlay = () => {
		playAudioCanvas(audioNodeDatabase);
	};
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
	<div>
		<label for="text">Text</label>
		<textarea id="text" bind:value={text} rows={20} />
	</div>
	<div>
		<label for="play">Play</label>
		<button id="play" on:click={handlePlay}>Play</button>
	</div>
</div>

<style>
	textarea {
		width: 100%;
	}
</style>
