import { globalContext } from '../GlobalContext';
import envelopeNodeWorkletUrl from './envelope?url';
import triggerNodeWorkletUrl from './trigger?url';

try {
	await Promise.all([
		globalContext.audioWorklet.addModule(envelopeNodeWorkletUrl),
		globalContext.audioWorklet.addModule(triggerNodeWorkletUrl)
	]);
} catch {
	console.log('Failed to register audio worklet');
}

export function createEnvelopeNode() {
	return new AudioWorkletNode(globalContext, 'envelope');
}

export function createTriggerNode() {
	return new AudioWorkletNode(globalContext, 'trigger');
}
