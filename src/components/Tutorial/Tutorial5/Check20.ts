import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that:
// 1. Clock is connected to AD Envelope
// 2. AD Envelope is connected to Gain's gain parameter
// 3. Gain's gain parameter is set to 0
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);
    
    // Find all required nodes
    const clockNode = nodes.find(node => node.type === 'clock');
    const adEnvelopeNode = nodes.find(node => node.type === 'ad-envelope');
    const gainNode = nodes.find(node => node.type === 'gain');
    
    // Ensure all nodes exist
    if (!clockNode || !adEnvelopeNode || !gainNode) {
        return false;
    }
    
    // Get node IDs
    const clockId = entries.find(entry => entry[1] === clockNode)?.[0];
    const adEnvelopeId = entries.find(entry => entry[1] === adEnvelopeNode)?.[0];
    
    // Check connections
    const clockConnectedToEnvelope = adEnvelopeNode.inputs.some(input => input.id === clockId);
    const envelopeConnectedToGainParam = gainNode.parameters?.gain?.inputs.some(
        input => input.id === adEnvelopeId
    ) ?? false;
    
    // Check if gain parameter is set to 0
    const gainIsZero = gainNode.parameters?.gain?.base === 0;
    
    return clockConnectedToEnvelope && envelopeConnectedToGainParam && gainIsZero;
}
