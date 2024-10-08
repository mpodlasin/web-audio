import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Sine node was created and connected to both Value and Oscilloscope nodes.
	const sineNode = values.find((node) => node.type === 'sine-oscillator');
	const sineNodeId = entries.find((entry) => entry[1] === sineNode)?.[0];

	const valueNode = values.find((node) => node.type === 'value');
	const oscilloscopeNode = values.find((node) => node.type === 'oscilloscope');

	const sineWasConnectedToValue =
		valueNode?.inputs?.some((input) => input.id === sineNodeId) ?? false;
	const sineWasConnectedToOscilloscope =
		oscilloscopeNode?.inputs?.some((input) => input.id === sineNodeId) ?? false;

	return sineWasConnectedToValue && sineWasConnectedToOscilloscope;
}
