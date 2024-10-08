import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

	// Clock was disconnected from Value and Oscilloscope nodes.
    const clockNode = values.find(node => node.type === 'clock');
    const clockNodeId = entries.find(entry => entry[1] === clockNode)?.[0];

    const valueNode = values.find(node => node.type === 'value');
    const oscilloscopeNode = values.find(node => node.type === 'oscilloscope');

    const clockWasDisconnectedFromValue = valueNode?.inputs?.every(input => input.id !== clockNodeId);
    const clockWasDisconnectedFromOscilloscope = oscilloscopeNode?.inputs?.every(input => input.id !== clockNodeId);

    // Clock was connected to Gate Length
    const gateLengthNode = values.find(node => node.type === 'gate-length');
    const gateLengthNodeId = entries.find(entry => entry[1] === gateLengthNode)?.[0];
    const clockWasConnectedToGateLength = gateLengthNode?.inputs?.some(input => input.id === clockNodeId);

    // Gate Length was connected to Value and Oscilloscope
    const gateLengthWasConnectedToValue = valueNode?.inputs?.some(input => input.id === gateLengthNodeId);
    const gateLengthWasConnectedToOscilloscope = oscilloscopeNode?.inputs?.some(input => input.id === gateLengthNodeId);

    return (clockWasDisconnectedFromValue && clockWasDisconnectedFromOscilloscope && clockWasConnectedToGateLength && gateLengthWasConnectedToValue && gateLengthWasConnectedToOscilloscope) ?? false;
}
