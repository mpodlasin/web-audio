import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that Sequencer and Pitch Quantizer nodes have been created
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Check for Sequencer node
    const hasSequencerNode = nodes.some(node => node.type === 'sequencer');
    
    // Check for Pitch Quantizer node
    const hasPitchQuantizerNode = nodes.some(node => node.type === 'pitch-quantizer');
    
    // Both nodes must exist
    return hasSequencerNode && hasPitchQuantizerNode;
}
