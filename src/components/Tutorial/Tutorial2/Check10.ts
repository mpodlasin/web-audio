import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const entries = Object.entries(audioGraph);
	const values = Object.values(audioGraph);

	// Sine node is connected to oscilloscope

	const sineNode = values.find((node) => node.type === 'sine-oscillator');
	const oscilloscopeNode = values.find((node) => node.type === 'oscilloscope');
	const sineNodeId = entries.find((entry) => entry[1] === sineNode)?.[0];

	if (sineNode && oscilloscopeNode && sineNodeId) {
		return (
			oscilloscopeNode.inputs?.some((input) =>
				typeof input === 'string' ? input === sineNodeId : input.id === sineNodeId
			) ?? false
		);
	}

	return false;
}
