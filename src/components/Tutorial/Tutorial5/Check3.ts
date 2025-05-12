import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that all four oscillator types have been created (exactly 4, no more)
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Check for each oscillator type
    const hasSineOscillator = nodes.some(node => node.type === 'sine-oscillator');
    const hasSawOscillator = nodes.some(node => node.type === 'saw-oscillator');
    const hasSquareOscillator = nodes.some(node => node.type === 'square-oscillator');
    const hasTriangleOscillator = nodes.some(node => node.type === 'triangle-oscillator');
    
    // Count total oscillators
    const totalOscillators = nodes.filter(node => 
        node.type === 'sine-oscillator' || 
        node.type === 'saw-oscillator' || 
        node.type === 'square-oscillator' || 
        node.type === 'triangle-oscillator'
    ).length;
    
    // All four oscillator types must exist AND there must be exactly 4 oscillators in total
    return hasSineOscillator && hasSawOscillator && hasSquareOscillator && hasTriangleOscillator && totalOscillators === 4;
}
