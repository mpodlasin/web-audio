import { globalContext } from '../GlobalContext';
import arEnvelopeNodeWorkletUrl from './ar-envelope.js?worker&url';
import sequencerNodeWorkletUrl from './sequencer.js?worker&url';
import pitchQuantizerNodeWorkletUrl from './pitchQuantizer.js?worker&url';
import scalerNodeWorkletUrl from './scaler.js?worker&url';
import gateLengthNodeWorkletUrl from './gate-length.js?worker&url';
import measureGateNodeWorkletUrl from './measure-gate.js?worker&url';
import patternNodeWorkletUrl from './pattern.js?worker&url';
import clockCounterNodeWorkletUrl from './clock-counter.js?worker&url';
import pulseToTriggerNodeWorkletUrl from './pulse-to-trigger.js?worker&url';

export async function loadCustomNodes() {
	try {
		await Promise.all([
			globalContext.audioWorklet.addModule(arEnvelopeNodeWorkletUrl),
			globalContext.audioWorklet.addModule(sequencerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(pitchQuantizerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(scalerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(gateLengthNodeWorkletUrl),
			globalContext.audioWorklet.addModule(measureGateNodeWorkletUrl),
			globalContext.audioWorklet.addModule(patternNodeWorkletUrl),
			globalContext.audioWorklet.addModule(clockCounterNodeWorkletUrl),
			globalContext.audioWorklet.addModule(pulseToTriggerNodeWorkletUrl)
		]);
	} catch {
		console.log('Failed to register audio worklet');
	}
}
