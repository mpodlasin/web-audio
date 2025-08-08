import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that Times nodes are connected to correct sine oscillators based on harmonic relationships
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find required nodes
	const numberNodes = nodes.filter((node) => node.type === 'number');
	const timesNodes = nodes.filter((node) => node.type === 'times');
	const sineOscillators = nodes.filter((node) => node.type === 'sine-oscillator');
	const gainNodes = nodes.filter((node) => node.type === 'gain');

	if (timesNodes.length !== 5 || sineOscillators.length < 6 || gainNodes.length < 5) return false;

	// Define harmonic mappings
	const harmonicMappings = [
		{ harmonic: 2, expectedGain: 0.5 },
		{ harmonic: 3, expectedGain: 0.33 },
		{ harmonic: 4, expectedGain: 0.25 },
		{ harmonic: 5, expectedGain: 0.2 },
		{ harmonic: 6, expectedGain: 0.167 }
	];

	// Validate each harmonic path
	for (const mapping of harmonicMappings) {
		// 1. Find Number node with harmonic value
		const harmonicNumber = numberNodes.find(
			(num) => num.parameters?.value?.base === mapping.harmonic
		);
		if (!harmonicNumber) return false;

		const harmonicNumberId = entries.find((entry) => entry[1] === harmonicNumber)?.[0];
		if (!harmonicNumberId) return false;

		// 2. Find Times node connected to this Number (first input)
		const connectedTimes = timesNodes.find((times) =>
			times.inputs.some((input) => input.id === harmonicNumberId && input.input === 'number-a')
		);
		if (!connectedTimes) return false;

		const connectedTimesId = entries.find((entry) => entry[1] === connectedTimes)?.[0];
		if (!connectedTimesId) return false;

		// 3. Find Sine oscillator connected to this Times (frequency parameter)
		const connectedSine = sineOscillators.find(
			(sine) =>
				sine.parameters?.frequency?.inputs.some((input) => input.id === connectedTimesId) &&
				sine.parameters?.frequency?.base === 0
		);
		if (!connectedSine) return false;

		const connectedSineId = entries.find((entry) => entry[1] === connectedSine)?.[0];
		if (!connectedSineId) return false;

		// 4. Find Gain node connected to this Sine
		const connectedGain = gainNodes.find((gain) =>
			gain.inputs.some((input) => input.id === connectedSineId)
		);
		if (!connectedGain) return false;

		// 5. Verify Gain has correct value
		if (connectedGain.parameters?.gain?.base !== mapping.expectedGain) {
			return false;
		}
	}

	return true;
}
