import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Spectrum node is created and present in the audio graph.
export default function (audioGraph: SerializedAudioElements) {
    const spectrumNode = Object.values(audioGraph).find((node) => node.type === 'spectrum');
    
    return spectrumNode !== undefined;
}
