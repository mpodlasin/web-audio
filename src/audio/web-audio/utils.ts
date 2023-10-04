import { globalContext } from '../GlobalContext';
import envelopeNodeWorkletUrl from './envelope.js?worker&url';
import triggerNodeWorkletUrl from './trigger.js?worker&url';
import sequencerNodeWorkletUrl from './sequencer.js?worker&url';
import pitchQuantizerNodeWorkletUrl from './pitchQuantizer.js?worker&url';
import scalerNodeWorkletUrl from './scaler.js?worker&url';

export async function loadCustomNodes() {
	try {
		await Promise.all([
			globalContext.audioWorklet.addModule(envelopeNodeWorkletUrl),
			globalContext.audioWorklet.addModule(triggerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(sequencerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(pitchQuantizerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(scalerNodeWorkletUrl)
		]);
	} catch {
		console.log('Failed to register audio worklet');
	}
}
