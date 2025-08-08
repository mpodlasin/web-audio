import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Switch node and an Output node have been created
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	
	// Check for Switch node
	const hasSwitchNode = nodes.some(node => node.type === 'switch');
	
	// Check for Output node (destination)
	const hasOutputNode = nodes.some(node => node.type === 'destination');
	
	// Both nodes must exist
	return hasSwitchNode && hasOutputNode;
}
