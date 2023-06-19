<script lang="ts">
	import { createAudioCanvas, type AudioNodeDatabase, playAudioCanvas } from '../audio/AudioCanvas';
	import { oscillatorGainDestination } from '../examples/oscillator-gain-desination'

	let text = JSON.stringify(oscillatorGainDestination, null, 2);

	const audioNodeDatabase: AudioNodeDatabase = {}

	createAudioCanvas(oscillatorGainDestination, audioNodeDatabase)

	const handlePlay = () => {
		playAudioCanvas(audioNodeDatabase)
	}
</script>

<div>
	<h2>Page</h2>
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
