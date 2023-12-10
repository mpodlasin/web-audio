import { globalContext } from '../GlobalContext';
import arEnvelopeNodeWorkletUrl from './ar-envelope.js?worker&url';
import triggerNodeWorkletUrl from './trigger.js?worker&url';
import sequencerNodeWorkletUrl from './sequencer.js?worker&url';
import pitchQuantizerNodeWorkletUrl from './pitchQuantizer.js?worker&url';
import scalerNodeWorkletUrl from './scaler.js?worker&url';
import gateLengthNodeWorkletUrl from './gate-length.js?worker&url';

export async function loadCustomNodes() {
	try {
		await Promise.all([
			globalContext.audioWorklet.addModule(arEnvelopeNodeWorkletUrl),
			globalContext.audioWorklet.addModule(triggerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(sequencerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(pitchQuantizerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(scalerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(gateLengthNodeWorkletUrl)
		]);
	} catch {
		console.log('Failed to register audio worklet');
	}
}
