import { globalContext } from '../GlobalContext';
import wasmWorkletUrl from './wasm/wasm-worklet.js?worker&url';
import clockCounterNodeWorkletUrl from './wasm/clock-counter/clock-counter-worklet.js?worker&url';
import patternNodeWorkletUrl from './wasm/pattern/pattern-worklet.js?worker&url';
import sequencerNodeWorkletUrl from './wasm/sequencer/sequencer-worklet.js?worker&url';
import pitchQuantizerNodeWorkletUrl from './wasm/pitch-quantizer/pitch-quantizer-worklet.js?worker&url';
import gateLengthNodeWorkletUrl from './wasm/gate-length/gate-length-worklet.js?worker&url';
import scalerNodeWorkletUrl from './wasm/scaler/scaler-worklet.js?worker&url';
import adEnvelopeNodeWorkletUrl from './wasm/ad-envelope/ad-envelope-worklet.js?worker&url';
import oscillatorNodeWorkletUrl from './wasm/oscillator-worklet.js?worker&url';

import measureGateWasmUrl from './wasm/measure-gate/measure-gate.wasm?url';
import clockCounterWasmUrl from './wasm/clock-counter/clock-counter.wasm?url';
import patternWasmUrl from './wasm/pattern/pattern.wasm?url';
import sequencerWasmUrl from './wasm/sequencer/sequencer.wasm?url';
import pitchQuantizerWasmUrl from './wasm/pitch-quantizer/pitch-quantizer.wasm?url';
import gateLengthWasmUrl from './wasm/gate-length/gate-length.wasm?url';
import scalerWasmUrl from './wasm/scaler/scaler.wasm?url';
import adEnvelopeWasmUrl from './wasm/ad-envelope/ad-envelope.wasm?url';
import squareOscillatorWasmUrl from './wasm/square-oscillator/square-oscillator.wasm?url';
import sawOscillatorWasmUrl from './wasm/saw-oscillator/saw-oscillator.wasm?url';

export async function loadCustomNodes() {
	try {
		await Promise.all([
			globalContext.audioWorklet.addModule(wasmWorkletUrl),
			globalContext.audioWorklet.addModule(clockCounterNodeWorkletUrl),
			globalContext.audioWorklet.addModule(sequencerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(patternNodeWorkletUrl),
			globalContext.audioWorklet.addModule(pitchQuantizerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(gateLengthNodeWorkletUrl),
			globalContext.audioWorklet.addModule(scalerNodeWorkletUrl),
			globalContext.audioWorklet.addModule(adEnvelopeNodeWorkletUrl),
			globalContext.audioWorklet.addModule(oscillatorNodeWorkletUrl),
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

export const createMeasureGateWorklet = () => createWasmWorklet('wasm', measureGateWasmUrl);
export const createClockCounterWorklet = () =>
	createWasmWorklet('clock-counter', clockCounterWasmUrl);
export const createPatternWorklet = () => createWasmWorklet('pattern', patternWasmUrl);
export const createSequencerWorklet = () => createWasmWorklet('sequencer', sequencerWasmUrl);
export const createPitchQuantizerWorklet = () =>
	createWasmWorklet('pitch-quantizer', pitchQuantizerWasmUrl);
export const createGateLengthWorklet = () => createWasmWorklet('gate-length', gateLengthWasmUrl);
export const createScalerWorklet = () => createWasmWorklet('scaler', scalerWasmUrl);
export const createAdEnvelopeWorklet = () => createWasmWorklet('ad-envelope', adEnvelopeWasmUrl);
export const createSquareOscillatorWorklet = () => createWasmWorklet('custom-oscillator', squareOscillatorWasmUrl);
export const createSawOscillatorWorklet = () => createWasmWorklet('custom-oscillator', sawOscillatorWasmUrl);
