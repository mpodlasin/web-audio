import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that all four oscillators are connected to the Switch node and to different inputs
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);
    
    // Find all required nodes
    const sineOscillator = nodes.find(node => node.type === 'sine-oscillator');
    const sawOscillator = nodes.find(node => node.type === 'saw-oscillator');
    const squareOscillator = nodes.find(node => node.type === 'square-oscillator');
    const triangleOscillator = nodes.find(node => node.type === 'triangle-oscillator');
    const switchNode = nodes.find(node => node.type === 'switch');
    
    // Ensure all nodes exist
    if (!sineOscillator || !sawOscillator || !squareOscillator || !triangleOscillator || !switchNode) {
        return false;
    }
    
    // Get node IDs
    const sineId = entries.find(entry => entry[1] === sineOscillator)?.[0];
    const sawId = entries.find(entry => entry[1] === sawOscillator)?.[0];
    const squareId = entries.find(entry => entry[1] === squareOscillator)?.[0];
    const triangleId = entries.find(entry => entry[1] === triangleOscillator)?.[0];
    
    // Check if each oscillator is connected to the Switch node
    const sineConnected = switchNode.inputs.some(input => input.id === sineId);
    const sawConnected = switchNode.inputs.some(input => input.id === sawId);
    const squareConnected = switchNode.inputs.some(input => input.id === squareId);
    const triangleConnected = switchNode.inputs.some(input => input.id === triangleId);
    
    // Check if all oscillators are connected to different inputs
    const oscillatorIds = [sineId, sawId, squareId, triangleId];
    const uniqueInputsUsed = new Set();
    
    switchNode.inputs.forEach(input => {
        if (oscillatorIds.includes(input.id)) {
            uniqueInputsUsed.add(input.input); // Add the input name to the set
        }
    });
    
    // All oscillators must be connected to the Switch node AND to different inputs
    return sineConnected && sawConnected && squareConnected && triangleConnected && uniqueInputsUsed.size === 4;
}
