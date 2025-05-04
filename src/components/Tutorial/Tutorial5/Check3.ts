import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that all four oscillator types have been created
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Check for each oscillator type
    const hasSineOscillator = nodes.some(node => node.type === 'sine-oscillator');
    const hasSawOscillator = nodes.some(node => node.type === 'saw-oscillator');
    const hasSquareOscillator = nodes.some(node => node.type === 'square-oscillator');
    const hasTriangleOscillator = nodes.some(node => node.type === 'triangle-oscillator');
    
    // All four oscillator types must exist
    return hasSineOscillator && hasSawOscillator && hasSquareOscillator && hasTriangleOscillator;
}
