import { globalContext } from '../GlobalContext';
import envelopeNodeWorkletUrl from './envelope?url';

try {
    await globalContext.audioWorklet.addModule(envelopeNodeWorkletUrl);
} catch {
    console.log("Failed to register envelope node worklet");
}

export function createEnvelopeNode() {
	return new AudioWorkletNode(globalContext, 'envelope');
}
