import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

	// Clock node was created and connected to both Value and Oscilloscope nodes.
	const clockNode = values.find(node => node.type === 'clock');
    const clockNodeId = entries.find(entry => entry[1] === clockNode)?.[0];

	const valueNode = values.find(node => node.type === 'value');
    const oscilloscopeNode = values.find(node => node.type === 'oscilloscope');

    const clockWasConnectedToValue = valueNode?.inputs?.some(input => input.id === clockNodeId) ?? false;
    const clockWasConnectedToOscilloscope = oscilloscopeNode?.inputs?.some(input => input.id === clockNodeId) ?? false;

    return clockWasConnectedToValue && clockWasConnectedToOscilloscope;
}
