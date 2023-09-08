import { globalContext } from '../GlobalContext';
import envelopeNodeWorkletUrl from './envelope?url';
import triggerNodeWorkletUrl from './trigger?url';

export async function loadCustomNodes() {
	try {
		await Promise.all([
			globalContext.audioWorklet.addModule(envelopeNodeWorkletUrl),
			globalContext.audioWorklet.addModule(triggerNodeWorkletUrl)
		]);
	} catch {
		console.log('Failed to register audio worklet');
	}
}
