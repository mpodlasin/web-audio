import { globalContext } from '../../../audio/GlobalContext';
import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks if transport is on and if output volume was raised
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Find the Output node
    const outputNode = nodes.find(node => node.type === 'destination');
    
    // If there's no Output node, validation fails
    if (!outputNode) {
        return false;
    }
    
    // Check if the volume parameter has been increased from the default (0)
    // and if the global audio context is running (transport is on)
    const volume = outputNode.parameters?.volume?.base ?? 0;
    
    return volume > 0 && globalContext.state === 'running';
}
