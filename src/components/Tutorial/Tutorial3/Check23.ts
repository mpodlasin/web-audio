import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the AD Envelope is connected to the frequency parameter of the Triangle Oscillator.
export default function (audioGraph: SerializedAudioElements) {
    const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const adEnvelope = values.find((node) => node.type === 'ad-envelope');
    const triangleOscillator = values.find((node) => node.type === 'triangle-oscillator');
    const adEnvelopeId = entries.find((entry) => entry[1] === adEnvelope)?.[0];

    const adEnvelopeIsConnectedToFrequency =
        triangleOscillator?.parameters?.frequency?.inputs?.some(
            (input) => input.id === adEnvelopeId
        ) ?? false;

    return adEnvelope && triangleOscillator && adEnvelopeIsConnectedToFrequency;
}
