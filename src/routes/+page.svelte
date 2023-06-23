<script lang="ts">
	import { createAudioCanvas, type AudioNodeDatabase, playAudioCanvas } from '../audio/AudioCanvas';
	import { oscillatorGainDestination } from '../examples/oscillator-gain-desination'
	import { triggerEnvelopeOscillatorGainDestination } from '../examples/trigger-envelope-oscillator-gain-destination';

	let chosenExample = 'oscillator-gain-destination'

	let text: string;
	$: if (chosenExample === 'oscillator-gain-destination') {
		text = JSON.stringify(oscillatorGainDestination, null, 2);
	} else if (chosenExample === 'trigger-envelope-oscillator-gain-destination') {
		text = JSON.stringify(triggerEnvelopeOscillatorGainDestination, null, 2);
	}

	let audioNodeDatabase: AudioNodeDatabase = {};

	$: {
		let exampleObject: any;
		if (chosenExample === 'oscillator-gain-destination') {
			exampleObject = oscillatorGainDestination;
		} else if (chosenExample === 'trigger-envelope-oscillator-gain-destination') {
			exampleObject = triggerEnvelopeOscillatorGainDestination;
		}

		audioNodeDatabase = {};

		createAudioCanvas(exampleObject, audioNodeDatabase)
	}

	const handlePlay = () => {
		playAudioCanvas(audioNodeDatabase)
	}
</script>

<div>
	<h2>Page</h2>
	<div>
		<label for="example">Chosen Example</label>
		<select id="example" bind:value={chosenExample}>
			<option value="oscillator-gain-destination">Oscillator Gain Destination</option>
			<option value="trigger-envelope-oscillator-gain-destination">Trigger Envelope Oscillator Gain Destination</option>
		</select>
	</div>
	<div>
		<label for="text">Text</label>
		<textarea id="text" bind:value={text} rows={20}></textarea>
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
