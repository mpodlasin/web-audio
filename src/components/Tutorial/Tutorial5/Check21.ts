import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that:
// 1. AD Envelope's decay parameter is set above 500ms
// 2. AD Envelope's attack parameter is set between 5 and 10ms
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Find the AD Envelope node
    const adEnvelopeNode = nodes.find(node => node.type === 'ad-envelope');
    
    // Ensure the AD Envelope node exists
    if (!adEnvelopeNode) {
        return false;
    }
    
    // Check if the decay parameter is set above 500ms
    const decay = adEnvelopeNode.parameters?.decay?.base ?? 0;
    const decayAbove500 = decay >= 500;
    
    // Check if the attack parameter is set between 5 and 10ms
    const attack = adEnvelopeNode.parameters?.attack?.base ?? 0;
    const attackBetween5And10 = attack >= 5 && attack <= 10;
    
    return decayAbove500 && attackBetween5And10;
}
