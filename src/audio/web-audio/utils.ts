import { globalContext } from '../GlobalContext';
import arEnvelopeNodeWorkletUrl from './ar-envelope.js?worker&url';
import adEnvelopeNodeWorkletUrl from './ad-envelope.js?worker&url';
import sequencerNodeWorkletUrl from './sequencer.js?worker&url';
import pitchQuantizerNodeWorkletUrl from './pitchQuantizer.js?worker&url';
import scalerNodeWorkletUrl from './scaler.js?worker&url';
import gateLengthNodeWorkletUrl from './gate-length.js?worker&url';
import patternNodeWorkletUrl from './pattern.js?worker&url';
import clockCounterNodeWorkletUrl from './clock-counter.js?worker&url';
import wasmWorkletUrl from './wasm/wasm-worklet.js?worker&url';

import pulseToTriggerWasmUrl from './wasm/pulse-to-trigger/pulse-to-trigger.wasm?url';
import measureGateWasmUrl from './wasm/measure-gate/measure-gate.wasm?url';

export async function loadCustomNodes() {
	try {
		await Promise.all([
			globalContext.audioWorklet.addModule(arEnvelopeNodeWorkletUrl),
			globalContext.audioWorklet.addModule(adEnvelopeNodeWorkletUrl),
			globalContext.audioWorklet.addModule(sequencerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(pitchQuantizerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(scalerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(gateLengthNodeWorkletUrl),
			globalContext.audioWorklet.addModule(patternNodeWorkletUrl),
			globalContext.audioWorklet.addModule(clockCounterNodeWorkletUrl),
			globalContext.audioWorklet.addModule(wasmWorkletUrl)
		]);
	} catch {
		console.log('Failed to register audio worklet');
	}
}

const createWasmWorklet = (wasmUrl: string) => {
	const wasmWorklet = new AudioWorkletNode(globalContext, 'wasm');

	fetch(wasmUrl).then(async (response) => {
		const byteCode = await response.arrayBuffer();
		wasmWorklet.port.postMessage(byteCode);
	});

	return wasmWorklet;
};

export const createPulseToTriggerWorklet = () => createWasmWorklet(pulseToTriggerWasmUrl);
export const createMeasureGateWorklet = () => createWasmWorklet(measureGateWasmUrl);
