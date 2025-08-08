import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that Number nodes are set to harmonic multipliers 2, 3, 4, 5, and 6
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	
	// Find number nodes
	const numberNodes = nodes.filter(node => node.type === 'number');
	
	// Check if we have number nodes with the expected harmonic values
	const has440Number = numberNodes.some(num => num.parameters?.value?.base === 440);
	const has2Number = numberNodes.some(num => num.parameters?.value?.base === 2);
	const has3Number = numberNodes.some(num => num.parameters?.value?.base === 3);
	const has4Number = numberNodes.some(num => num.parameters?.value?.base === 4);
	const has5Number = numberNodes.some(num => num.parameters?.value?.base === 5);
	const has6Number = numberNodes.some(num => num.parameters?.value?.base === 6);
	
	return has440Number && has2Number && has3Number && has4Number && has5Number && has6Number;
}
