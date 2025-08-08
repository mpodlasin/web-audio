import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that main frequency Number (440) is connected to saw oscillator frequency parameter (set to 0)
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find required nodes
	const numberNodes = nodes.filter((node) => node.type === 'number');
	const sawOscillator = nodes.find((node) => node.type === 'saw-oscillator');

	if (!sawOscillator) return false;

	// Find the main frequency Number node (440)
	const mainFreqNumber = numberNodes.find((num) => num.parameters?.value?.base === 440);
	if (!mainFreqNumber) return false;

	// Check that saw oscillator frequency is set to 0
	if (sawOscillator.parameters?.frequency?.base !== 0) return false;

	// Get main frequency Number ID
	const mainFreqId = entries.find((entry) => entry[1] === mainFreqNumber)?.[0];
	if (!mainFreqId) return false;

	// Check that main frequency Number is connected to saw oscillator frequency parameter
	const isConnected =
		sawOscillator.parameters?.frequency?.inputs.some((input) => input.id === mainFreqId) ?? false;

	return isConnected;
}
