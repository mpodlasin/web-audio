<script>
	let type = 'sine';
</script>

<div>
	<h2>Oscillator</h2>
	<div>
		<label for="oscillator-type">Type</label>
		<select id="oscillator-type" bind:value={type}>
			<option value="sine">Sine</option>
			<option value="square">Square</option>
			<option value="sawtooth">Sawtooth</option>
			<option value="triangle">Triangle</option>
		</select>
	</div>
	<div>
		<label for="oscillator-frequency">Frequency</label>
		<input id="oscillator-frequency" type="number" min="0" max="1000" step="1" value="440" />
	</div>
</div>
