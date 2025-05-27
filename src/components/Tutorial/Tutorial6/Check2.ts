import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Spectrum node has been created
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Find the Spectrum node
    const spectrumNode = nodes.find(node => node.type === 'spectrum');
    
    return !!spectrumNode;
}
