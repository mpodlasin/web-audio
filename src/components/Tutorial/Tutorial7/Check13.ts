import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that exactly one Gain node is created with gain set to 0.5 (1/2 for second harmonic)
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Find all gain nodes - should have exactly 1
	const gainNodes = nodes.filter((node) => node.type === 'gain');
	if (gainNodes.length !== 1) {
		return false;
	}

	// Check if the single gain node has gain set to 0.5
	const gainNode = gainNodes[0];
	return gainNode?.parameters?.gain?.base === 0.5;
}
