import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Saw LFO is created and connected to the Oscilloscope node.
export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	const sawLFO = values.find((node) => node.type === 'saw-lfo');
	const oscilloscopeNode = values.find((node) => node.type === 'oscilloscope');
	const sawLFOId = entries.find((entry) => entry[1] === sawLFO)?.[0];

	const sawLFOIsConnectedToOscilloscope =
		oscilloscopeNode?.inputs?.some((input) => input.id === sawLFOId) ?? false;

	return (sawLFO && oscilloscopeNode && sawLFOIsConnectedToOscilloscope) ?? false;
}
