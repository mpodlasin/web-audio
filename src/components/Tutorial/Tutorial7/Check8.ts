import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a second Spectrum node exists and is connected to the second input of the Switch node
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find all spectrum nodes - should be exactly 2
	const spectrumNodes = nodes.filter((node) => node.type === 'spectrum');
	if (spectrumNodes.length !== 2) {
		return false;
	}

	// Find the switch node
	const switchNode = nodes.find((node) => node.type === 'switch');
	if (!switchNode) {
		return false;
	}

	// Get spectrum node IDs
	const spectrumNodeIds = spectrumNodes
		.map((spectrumNode) => entries.find((entry) => entry[1] === spectrumNode)?.[0])
		.filter((id) => id !== undefined);

	// Check that switch node has exactly 2 inputs
	if (switchNode.inputs.length !== 2) {
		return false;
	}

	// Verify that BOTH switch inputs come from spectrum nodes
	const switchInputIds = switchNode.inputs.map((input) => input.id);
	const allInputsFromSpectrum = switchInputIds.every((inputId) =>
		spectrumNodeIds.includes(inputId)
	);

	// Also verify that each spectrum node connects to a DIFFERENT input port
	// (no duplicate connections to the same input port)
	const inputPortNames = switchNode.inputs.map((input) => input.input);
	const uniqueInputPorts = new Set(inputPortNames);
	const noDuplicateInputPorts = uniqueInputPorts.size === inputPortNames.length;

	return allInputsFromSpectrum && noDuplicateInputPorts;
}
