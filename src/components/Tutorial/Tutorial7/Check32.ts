import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that Switch is set to channel 1 to test the saw wave frequency control
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Find the switch node
	const switchNode = nodes.find((node) => node.type === 'switch');
	if (!switchNode) return false;

	// Check that switch is set to channel 1 (for testing saw wave)
	return switchNode.parameters?.channel?.base === 1;
}
