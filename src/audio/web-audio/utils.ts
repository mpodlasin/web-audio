import { globalContext } from '../GlobalContext';
import arEnvelopeNodeWorkletUrl from './ar-envelope.js?worker&url';
import adEnvelopeNodeWorkletUrl from './ad-envelope.js?worker&url';
import scalerNodeWorkletUrl from './scaler.js?worker&url';
//WASM
import wasmWorkletUrl from './wasm/wasm-worklet.js?worker&url';
import clockCounterNodeWorkletUrl from './wasm/clock-counter/clock-counter-worklet.js?worker&url';
import patternNodeWorkletUrl from './wasm/pattern/pattern-worklet.js?worker&url';
import sequencerNodeWorkletUrl from './wasm/sequencer/sequencer-worklet.js?worker&url';
import pitchQuantizerNodeWorkletUrl from './wasm/pitch-quantizer/pitch-quantizer-worklet.js?worker&url';
import gateLengthNodeWorkletUrl from './wasm/gate-length/gate-length-worklet.js?worker&url';

import pulseToTriggerWasmUrl from './wasm/pulse-to-trigger/pulse-to-trigger.wasm?url';
import measureGateWasmUrl from './wasm/measure-gate/measure-gate.wasm?url';
import clockCounterWasmUrl from './wasm/clock-counter/clock-counter.wasm?url';
import patternWasmUrl from './wasm/pattern/pattern.wasm?url';
import sequencerWasmUrl from './wasm/sequencer/sequencer.wasm?url';
import pitchQuantizerWasmUrl from './wasm/pitch-quantizer/pitch-quantizer.wasm?url';
import gateLengthWasmUrl from './wasm/gate-length/gate-length.wasm?url';

export async function loadCustomNodes() {
	try {
		await Promise.all([
			globalContext.audioWorklet.addModule(arEnvelopeNodeWorkletUrl),
			globalContext.audioWorklet.addModule(adEnvelopeNodeWorkletUrl),
			globalContext.audioWorklet.addModule(scalerNodeWorkletUrl),
			// WASM
			globalContext.audioWorklet.addModule(wasmWorkletUrl),
			globalContext.audioWorklet.addModule(clockCounterNodeWorkletUrl),
			globalContext.audioWorklet.addModule(sequencerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(patternNodeWorkletUrl),
			globalContext.audioWorklet.addModule(pitchQuantizerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(gateLengthNodeWorkletUrl),
		]);
	} catch {
		console.log('Failed to register audio worklet');
	}
}

const createWasmWorklet = (workletName: string, wasmUrl: string) => {
	const wasmWorklet = new AudioWorkletNode(globalContext, workletName);

	fetch(wasmUrl).then(async (response) => {
		const byteCode = await response.arrayBuffer();
		wasmWorklet.port.postMessage(byteCode);
	});

	return wasmWorklet;
};

export const createPulseToTriggerWorklet = () => createWasmWorklet('wasm', pulseToTriggerWasmUrl);
export const createMeasureGateWorklet = () => createWasmWorklet('wasm', measureGateWasmUrl);
export const createClockCounterWorklet = () =>
	createWasmWorklet('clock-counter', clockCounterWasmUrl);
export const createPatternWorklet = () => createWasmWorklet('pattern', patternWasmUrl);
export const createSequencerWorklet = () => createWasmWorklet('sequencer', sequencerWasmUrl);
export const createPitchQuantizerWorklet = () => createWasmWorklet('pitch-quantizer', pitchQuantizerWasmUrl);
export const createGateLengthWorklet = () => createWasmWorklet('gate-length', gateLengthWasmUrl);
