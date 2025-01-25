import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Saw LFO is connected to the AD Envelope's trigger input.
export default function (audioGraph: SerializedAudioElements) {
    const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const sawLFO = values.find((node) => node.type === 'saw-lfo');
    const adEnvelope = values.find((node) => node.type === 'ad-envelope');
    const sawLFOId = entries.find((entry) => entry[1] === sawLFO)?.[0];

    const sawLFOIsConnectedToADEnvelope =
        adEnvelope?.inputs?.some((input) => input.id === sawLFOId && input.input === 'trigger') ?? false;

    return sawLFO && adEnvelope && sawLFOIsConnectedToADEnvelope;
}
