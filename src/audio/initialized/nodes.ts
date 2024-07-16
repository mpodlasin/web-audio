import { globalContext } from '../GlobalContext';
import { allowedSerializedAudioElementStaticDefinitions, type NodeType } from '../serialized';
import { settings } from '../settings';
import { generateReverb } from '../web-audio/reverbGeneration';
import {
	type CustomAudioNode,
	type CustomAudioNodeWithWebApiNode,
	type CustomAudioScheduledSourceNode,
	type CustomAudioParam,
	isCustomAudioParam,
	isCustomAudioNode,
	type Output,
	type Destination
} from './types';
import { accessParameter } from './update';

abstract class GenericCustomAudioNode implements CustomAudioNode {
	constructor(private id: string, protected type: NodeType) {}

	private parameterAnalysers: { [parameterName: string]: AnalyserNode } = {};
	private parameterMultipliers: {
		[parameterName: string]: {
			[inputId: string]: GainNode;
		};
	} = {};

	abstract getOutputNode(name?: string): AudioNode;

	abstract getAudioParam(parameterName: string): AudioParam;

	abstract getInputNode(): AudioNode | null;

	disconnect(): void {
		const staticDefinition = allowedSerializedAudioElementStaticDefinitions[this.type];

		const outputs = staticDefinition.outputs;

		outputs.forEach((output) => {
			this.getOutput(output.id).disconnect();
		});
	}

	getOutput(name?: string): Output {
		const id = this.id;
		const outputNode = this.getOutputNode(name);

		return {
			connect(destination: Destination) {
				if (isCustomAudioNode(destination)) {
					const inputNode = destination.getInputNode();
					if (inputNode) {
						outputNode.connect(inputNode);
					}
					return;
				}

				if (isCustomAudioParam(destination)) {
					outputNode.connect(destination.getMultiplierForInput(id));
					return;
				}

				if (destination instanceof AudioParam) {
					outputNode.connect(destination);
					return;
				}

				outputNode.connect(destination);
			},

			disconnect(destination: Destination | undefined) {
				if (destination === undefined) {
					outputNode.disconnect();
					return;
				}

				if (destination instanceof AudioParam) {
					outputNode.disconnect(destination);
					return;
				}

				if (isCustomAudioParam(destination)) {
					outputNode.disconnect(destination.getMultiplierForInput(id));
					return;
				}

				if (isCustomAudioNode(destination)) {
					const inputNode = destination.getInputNode();

					if (inputNode) {
						outputNode.disconnect(inputNode);
					}

					return;
				}

				outputNode.disconnect(destination);
				return;
			}
		};
	}

	getParameter(parameterName: string): CustomAudioParam {
		const audioParam = this.getAudioParam(parameterName);

		if (!this.parameterAnalysers[parameterName]) {
			this.parameterAnalysers[parameterName] = globalContext.createAnalyser();
		}

		const analyser = this.parameterAnalysers[parameterName];

		if (!analyser) throw new Error();

		return {
			audioParam,
			analyser,
			getMultiplierForInput: (inputId: string) => {
				if (!this.parameterMultipliers[parameterName]) {
					this.parameterMultipliers[parameterName] = {};
				}

				const multipliersForParameter = this.parameterMultipliers[parameterName];

				if (!multipliersForParameter) throw new Error();

				if (!multipliersForParameter[inputId]) {
					const multiplier = globalContext.createGain();
					multiplier.connect(audioParam);
					multiplier.connect(analyser);
					multiplier.gain.value = 1;
					multipliersForParameter[inputId] = multiplier;
				}

				const multiplierForParameterAndInputId = multipliersForParameter[inputId];

				if (!multiplierForParameterAndInputId) throw new Error();

				return multiplierForParameterAndInputId;
			}
		};
	}

	connect(destination: CustomAudioNode | AudioParam | CustomAudioParam): void {
		if (destination instanceof AudioParam) {
			this.getOutput().connect(destination);

			return;
		}

		if (isCustomAudioNode(destination)) {
			const inputNode = destination.getInputNode();
			if (inputNode) {
				this.getOutput().connect(inputNode);
			}
		}

		if (isCustomAudioParam(destination)) {
			this.getOutput().connect(destination.getMultiplierForInput(this.id));

			return;
		}
	}

	onHighlightParameter(callback: (parameterName: string) => void): void {
		return;
	}
}

export class GenericCustomAudioNodeWithWebApiNode<T extends AudioNode>
	extends GenericCustomAudioNode
	implements CustomAudioNodeWithWebApiNode<T>
{
	readonly webApiNode: T;

	constructor(webApiNode: T, id: string, type: NodeType) {
		super(id, type);
		this.webApiNode = webApiNode;
	}

	getInputNode(): AudioNode {
		return this.webApiNode;
	}

	getOutputNode(): AudioNode {
		return this.webApiNode;
	}

	getAudioParam(parameterName: string): AudioParam {
		return accessParameter(this.webApiNode, parameterName);
	}
}

export class CustomAudioNodeWithWebApiAudioScheduledSourceNode<T extends AudioScheduledSourceNode>
	extends GenericCustomAudioNodeWithWebApiNode<T>
	implements CustomAudioScheduledSourceNode
{
	start(when?: number): void {
		this.webApiNode.start(when);
	}

	stop(when?: number): void {
		this.webApiNode.stop(when);
	}
}

export class CustomOscillatorNode
	extends GenericCustomAudioNode
	implements CustomAudioScheduledSourceNode
{
	readonly output: GainNode;
	readonly leftOscillator: OscillatorNode;
	readonly rightOscillator: OscillatorNode;
	readonly frequency: ConstantSourceNode;
	readonly detune: ConstantSourceNode;

	static oscillatorTypeToNodeType: { [P in OscillatorType]: NodeType } = {
		custom: 'sine-oscillator',
		sine: 'sine-oscillator',
		sawtooth: 'saw-oscillator',
		triangle: 'triangle-oscillator',
		square: 'square-oscillator'
	};

	constructor(id: string, type: OscillatorType) {
		super(id, CustomOscillatorNode.oscillatorTypeToNodeType[type]);

		const leftOscillator = globalContext.createOscillator();
		leftOscillator.type = type;
		leftOscillator.frequency.value = 0;

		const rightOscillator = globalContext.createOscillator();
		rightOscillator.type = type;
		rightOscillator.frequency.value = 0;

		const leftPan = globalContext.createStereoPanner();
		leftPan.pan.value = -1;

		const rightPan = globalContext.createStereoPanner();
		rightPan.pan.value = 1;

		const gain = globalContext.createGain();

		const frequency = globalContext.createConstantSource();

		frequency.connect(leftOscillator.frequency);
		frequency.connect(rightOscillator.frequency);

		const detune = globalContext.createConstantSource();

		const minusOne = globalContext.createGain();
		minusOne.gain.value = -1;

		detune.connect(minusOne);

		minusOne.connect(leftOscillator.detune);
		detune.connect(rightOscillator.detune);

		leftOscillator.connect(leftPan);
		rightOscillator.connect(rightPan);

		leftPan.connect(gain);
		rightPan.connect(gain);

		this.detune = detune;
		this.frequency = frequency;
		this.output = gain;
		this.leftOscillator = leftOscillator;
		this.rightOscillator = rightOscillator;
	}

	start(when?: number | undefined): void {
		this.frequency.start(when);
		this.detune.start(when);
		this.leftOscillator.start(when);
		this.rightOscillator.start(when);
	}

	stop(when?: number | undefined): void {
		this.frequency.stop(when);
		this.detune.stop(when);
		this.leftOscillator.stop(when);
		this.rightOscillator.stop(when);
	}

	getInputNode(): AudioNode | null {
		return null;
	}

	getOutputNode(): AudioNode {
		return this.output;
	}

	getAudioParam(parameterName: string): AudioParam {
		if (parameterName === 'frequency') {
			return this.frequency.offset;
		} else if (parameterName === 'detune') {
			return this.detune.offset;
		} else {
			throw Error(`Unknown parameter ${parameterName}`);
		}
	}
}

export class CustomSineOscillatorNode extends CustomOscillatorNode {
	constructor(id: string) {
		super(id, 'sine');
	}
}

export class CustomSawOscillatorNode extends CustomOscillatorNode {
	constructor(id: string) {
		super(id, 'sawtooth');
	}
}

export class CustomSquareOscillatorNode extends CustomOscillatorNode {
	constructor(id: string) {
		super(id, 'square');
	}
}

export class CustomTriangleOscillatorNode extends CustomOscillatorNode {
	constructor(id: string) {
		super(id, 'triangle');
	}
}

export class CustomPanNode extends GenericCustomAudioNodeWithWebApiNode<StereoPannerNode> {
	constructor(id: string) {
		super(globalContext.createStereoPanner(), id, 'pan');
	}
}

export class CustomGateLengthNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(new AudioWorkletNode(globalContext, 'gate-length'), id, 'gate-length');
	}
}

export class CustomBipolarToUnipolarNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(new AudioWorkletNode(globalContext, 'scaler'), id, 'bipolar-to-unipolar');
	}
}

export class EmptyCustomAudioNode implements CustomAudioNode {
	getOutput(): Output {
		throw new Error('Method not implemented.');
	}
	getInputNode(): AudioNode | null {
		throw new Error('Method not implemented.');
	}
	getParameter(): CustomAudioParam {
		throw new Error('Method not implemented.');
	}
	disconnect() {
		// Needs to be empty because of cleanup that happens on AudioCanvas unmount.
	}
	onHighlightParameter(): void {
		throw new Error('Method not implemented.');
	}
}

export class CustomFilterNode extends GenericCustomAudioNodeWithWebApiNode<BiquadFilterNode> {
	static filterTypeToNodeType: { [P in BiquadFilterType]: NodeType } = {
		highpass: 'highpass-filter',
		bandpass: 'bandpass-filter',
		lowpass: 'lowpass-filter',
		allpass: 'lowpass-filter',
		notch: 'lowpass-filter',
		highshelf: 'lowpass-filter',
		lowshelf: 'lowpass-filter',
		peaking: 'lowpass-filter'
	};

	constructor(id: string, type: BiquadFilterType) {
		const filter = globalContext.createBiquadFilter();
		filter.type = type;
		super(filter, id, CustomFilterNode.filterTypeToNodeType[type]);
	}

	getParameter(parameterName: string): CustomAudioParam {
		if (parameterName === 'resonance') {
			return super.getParameter('Q');
		}

		return super.getParameter(parameterName);
	}
}

export class CustomBandpassFilterNode extends CustomFilterNode {
	constructor(id: string) {
		super(id, 'bandpass');
	}
}

export class CustomLowpassFilterNode extends CustomFilterNode {
	constructor(id: string) {
		super(id, 'lowpass');
	}
}

export class CustomHighpassFilterNode extends CustomFilterNode {
	constructor(id: string) {
		super(id, 'highpass');
	}
}

export class CustomGainNode extends GenericCustomAudioNodeWithWebApiNode<GainNode> {
	constructor(id: string) {
		super(globalContext.createGain(), id, 'gain');
	}
}

export class CustomMultiplyNode extends GenericCustomAudioNodeWithWebApiNode<GainNode> {
	constructor(id: string) {
		super(globalContext.createGain(), id, 'multiply');
	}

	getParameter(parameterName: string): CustomAudioParam {
		if (parameterName === 'factor') {
			return super.getParameter('gain');
		} else {
			return super.getParameter(parameterName);
		}
	}
}

export class CustomOscilloscopeNode extends GenericCustomAudioNodeWithWebApiNode<AnalyserNode> {
	slow: ConstantSourceNode;

	constructor(id: string) {
		super(globalContext.createAnalyser(), id, 'oscilloscope');

		const slow = globalContext.createConstantSource();
		slow.start();
		slow.offset.value = 0;

		this.slow = slow;
	}

	getAudioParam(parameterName: string): AudioParam {
		if (parameterName === 'slow') {
			return this.slow.offset;
		}

		return accessParameter(this.webApiNode, parameterName);
	}
}

export class ADEnvelopeNode extends GenericCustomAudioNode implements CustomAudioNode {
	readonly attack: ConstantSourceNode;
	readonly gateLength: AudioWorkletNode;
	readonly arEnvelope: AudioWorkletNode;

	constructor(id: string) {
		super(id, 'ad-envelope');

		const attack = globalContext.createConstantSource();
		attack.start();

		const attackInSecondsGain = globalContext.createGain();

		attackInSecondsGain.gain.value = 1 / 1000;

		const gateLength = new AudioWorkletNode(globalContext, 'gate-length');

		const arEnvelope = new AudioWorkletNode(globalContext, 'ar-envelope');

		const envelopeAttackParameter = arEnvelope.parameters.get('attack');
		const lengthParameter = gateLength.parameters.get('length');

		if (envelopeAttackParameter) {
			attack.connect(envelopeAttackParameter);
		}

		if (lengthParameter) {
			attack.connect(attackInSecondsGain);
			attackInSecondsGain.connect(lengthParameter);
		}

		gateLength.connect(arEnvelope);

		this.attack = attack;
		this.gateLength = gateLength;
		this.arEnvelope = arEnvelope;
	}

	getAudioParam(parameterName: string): AudioParam {
		if (parameterName === 'decay') {
			return accessParameter(this.arEnvelope, 'release');
		}

		if (parameterName === 'attack') {
			return this.attack.offset;
		}

		throw new Error(`Parmeter ${parameterName} does not exist on AD Envelope node`);
	}

	getInputNode(): AudioNode | null {
		return this.gateLength;
	}

	getOutputNode(): AudioNode {
		return this.arEnvelope;
	}
}

export class AREnvelopeNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(new AudioWorkletNode(globalContext, 'ar-envelope'), id, 'ar-envelope');
	}
}

export class PitchQuantizerNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(new AudioWorkletNode(globalContext, 'pitch-quantizer'), id, 'pitch-quantizer');
	}
}

export class MeasureGateNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(new AudioWorkletNode(globalContext, 'measure-gate'), id, 'measure-gate');
	}
}

export class GenericCustomAudioNodeWithWebApiNodeWithTriggerHighlight extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	private counterAnalyser: AnalyserNode;
	private input: GainNode;

	constructor(node: AudioWorkletNode, id: string, type: NodeType) {
		const counter = new AudioWorkletNode(globalContext, 'clock-counter');
		const counterAnalyser = globalContext.createAnalyser();
		const input = globalContext.createGain();

		input.gain.value = 1;

		const modulo = counter.parameters.get('modulo');

		input.connect(counter).connect(counterAnalyser);
		input.connect(node);

		if (modulo) {
			modulo.value = 8;
		}

		super(node, id, type);

		this.counterAnalyser = counterAnalyser;
		this.input = input;
	}

	lastValue = 7;

	getInputNode(): AudioNode {
		return this.input;
	}

	onHighlightParameter(callback: (parameterName: string) => void): void {
		const staticParameters = allowedSerializedAudioElementStaticDefinitions[this.type].parameters;
		const analyser = this.counterAnalyser;
		analyser.fftSize = 2048;
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Float32Array(bufferLength);

		const highlightParameter = () => {
			analyser.getFloatTimeDomainData(dataArray);
			let value = (dataArray[0] ?? 0) - 1;

			if (value === -1) {
				value = 7;
			}

			if (value !== this.lastValue) {
				this.lastValue = value;

				const parameterName = Object.entries(staticParameters).filter(([_, parameter]) => {
					return parameter.highlightIndex === this.lastValue;
				})?.[0]?.[0];

				if (parameterName) {
					callback(parameterName);
				}
			}
			requestAnimationFrame(highlightParameter);
		};
		highlightParameter();
	}
}

export class SequencerNode extends GenericCustomAudioNodeWithWebApiNodeWithTriggerHighlight {
	constructor(id: string) {
		super(new AudioWorkletNode(globalContext, 'sequencer'), id, 'sequencer');
	}
}

export class CustomPatternNode extends GenericCustomAudioNodeWithWebApiNodeWithTriggerHighlight {
	constructor(id: string) {
		super(new AudioWorkletNode(globalContext, 'pattern'), id, 'pattern');
	}
}

export class ClockNode extends GenericCustomAudioNode implements CustomAudioNode {
	private gateLength: AudioNode;
	private tempo: ConstantSourceNode;

	constructor(id: string) {
		super(id, 'clock');

		const squareOscillator = globalContext.createOscillator();
		squareOscillator.start();
		squareOscillator.type = 'square';
		squareOscillator.frequency.value = 0;

		const pulseToTrigger = new AudioWorkletNode(globalContext, 'pulse-to-trigger');
		const gateLength = new AudioWorkletNode(globalContext, 'gate-length');
		this.gateLength = gateLength;

		const tempo = globalContext.createConstantSource();
		tempo.start();
		this.tempo = tempo;

		const bpmToFrequencyGain = globalContext.createGain();
		bpmToFrequencyGain.gain.value = 1 / 60;

		tempo.connect(bpmToFrequencyGain);
		bpmToFrequencyGain.connect(squareOscillator.frequency);

		squareOscillator.connect(pulseToTrigger);
		pulseToTrigger.connect(gateLength);
	}

	getAudioParam(parameterName: string): AudioParam {
		if (parameterName === 'tempo') {
			return this.tempo.offset;
		}

		throw new Error(`Parmeter ${parameterName} does not exist on Clock node`);
	}

	getInputNode(): AudioNode | null {
		return null;
	}

	getOutputNode(): AudioNode {
		return this.gateLength;
	}
}

export class _ClockNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(new AudioWorkletNode(globalContext, 'trigger'), id, 'clock');
	}

	start() {
		const running = this.webApiNode.parameters.get('running');

		if (running) {
			running.value = 1;
		}
	}

	stop() {
		const running = this.webApiNode.parameters.get('running');

		if (running) {
			running.value = 0;
		}
	}
}

export class DestinationNode extends GenericCustomAudioNodeWithWebApiNode<AudioDestinationNode> {
	constructor(id: string) {
		super(globalContext.destination, id, 'destination');
	}
}

export class CustomConvolutionNode extends GenericCustomAudioNode {
	static async fetchReverb(convolver: ConvolverNode) {
		generateReverb(
			{
				sampleRate: globalContext.sampleRate,
				decayTime: 10
			},
			(response) => {
				convolver.buffer = response;
			}
		);
	}

	private input: GainNode;
	private convolution: ConvolverNode;
	private output: GainNode;
	private mix: ConstantSourceNode;

	constructor(id: string) {
		super(id, 'convolution');

		const convolution = globalContext.createConvolver();

		const mix = globalContext.createConstantSource();
		const negate = globalContext.createGain();
		const input = globalContext.createGain();
		const output = globalContext.createGain();
		const dryGain = globalContext.createGain();
		const wetGain = globalContext.createGain();

		input.gain.value = 1;
		output.gain.value = 1;

		negate.gain.value = -1;

		dryGain.gain.value = 1;
		wetGain.gain.value = 0;

		mix.start();

		input.connect(dryGain);
		input.connect(convolution).connect(wetGain);

		mix.connect(wetGain.gain);
		mix.connect(negate).connect(dryGain.gain);

		wetGain.connect(output);
		dryGain.connect(output);

		this.mix = mix;
		this.input = input;
		this.convolution = convolution;
		this.output = output;

		CustomConvolutionNode.fetchReverb(convolution);
	}

	getInputNode(): AudioNode | null {
		return this.input;
	}

	getOutputNode(): AudioNode {
		return this.output;
	}

	getAudioParam(parameterName: string): AudioParam {
		if (parameterName === 'mix') {
			return this.mix.offset;
		}

		return accessParameter(this.convolution, parameterName);
	}
}

export class CustomDelayNode extends GenericCustomAudioNode {
	private input: GainNode;
	private delay: DelayNode;
	private feedbackGain: GainNode;
	private output: GainNode;
	private mix: ConstantSourceNode;
	private triggerMeasure: AudioWorkletNode;

	constructor(id: string) {
		super(id, 'delay');
		const delayMaxValue =
			allowedSerializedAudioElementStaticDefinitions['delay'].parameters['delayTime']?.maxValue;
		const delay = globalContext.createDelay(delayMaxValue);

		const triggerMeasure = new AudioWorkletNode(globalContext, 'measure-gate');

		const mix = globalContext.createConstantSource();
		const negate = globalContext.createGain();
		const feedbackGain = globalContext.createGain();
		const input = globalContext.createGain();
		const output = globalContext.createGain();
		const dryGain = globalContext.createGain();
		const wetGain = globalContext.createGain();

		triggerMeasure.connect(delay.delayTime);

		input.gain.value = 1;
		output.gain.value = 1;

		negate.gain.value = -1;

		dryGain.gain.value = 1;
		wetGain.gain.value = 0;

		mix.start();

		input.connect(dryGain);
		input.connect(delay).connect(wetGain);

		mix.connect(wetGain.gain);
		mix.connect(negate).connect(dryGain.gain);

		feedbackGain.connect(delay);
		delay.connect(feedbackGain);

		wetGain.connect(output);
		dryGain.connect(output);

		this.mix = mix;
		this.input = input;
		this.delay = delay;
		this.feedbackGain = feedbackGain;
		this.output = output;
		this.triggerMeasure = triggerMeasure;
	}

	getInputNode(name?: string): AudioNode | null {
		if (name === 'trigger') {
			return this.triggerMeasure;
		}

		return this.input;
	}

	getOutputNode(): AudioNode {
		return this.output;
	}

	getAudioParam(parameterName: string): AudioParam {
		if (parameterName === 'feedback') {
			return this.feedbackGain.gain;
		}

		if (parameterName === 'mix') {
			return this.mix.offset;
		}

		return accessParameter(this.delay, parameterName);
	}
}

export class CustomLFONode
	extends GenericCustomAudioNode
	implements CustomAudioScheduledSourceNode
{
	private oscillator: OscillatorNode;
	private mult: GainNode;
	private scalerOn: ConstantSourceNode;
	private minusOne: ConstantSourceNode;
	private negateOn: ConstantSourceNode;

	static oscillatorTypeToNodeType: { [P in OscillatorType]: NodeType } = {
		custom: 'sine-oscillator',
		sine: 'sine-oscillator',
		sawtooth: 'saw-oscillator',
		triangle: 'triangle-oscillator',
		square: 'square-oscillator'
	};

	constructor(id: string, type: OscillatorType) {
		super(id, CustomLFONode.oscillatorTypeToNodeType[type]);

		const oscillator = globalContext.createOscillator();

		const mult = globalContext.createGain();
		const negate = globalContext.createGain();
		const timesMinusTwo = globalContext.createGain();
		const negateOn = globalContext.createConstantSource();

		negateOn.connect(timesMinusTwo).connect(negate.gain);

		timesMinusTwo.gain.value = -2;
		negate.gain.value = 1;

		const scaler = new AudioWorkletNode(globalContext, 'scaler');
		const scalerOn = globalContext.createConstantSource();
		const minusOne = globalContext.createConstantSource();
		minusOne.offset.value = -1;
		scalerOn.offset.value = 0;

		oscillator.type = type;

		oscillator.connect(scaler).connect(negate).connect(mult);

		const aTo = scaler.parameters.get('a-to');

		if (aTo) {
			scalerOn.connect(minusOne.offset);
			minusOne.connect(aTo);
		}

		this.oscillator = oscillator;
		this.mult = mult;
		this.scalerOn = scalerOn;
		this.minusOne = minusOne;
		this.negateOn = negateOn;
	}

	getInputNode(): AudioNode | null {
		return this.oscillator;
	}

	getOutputNode(): AudioNode {
		return this.mult;
	}

	getAudioParam(parameterName: string): AudioParam {
		if (parameterName === 'negate') {
			return this.negateOn.offset;
		}

		if (parameterName === 'unipolar') {
			return this.scalerOn.offset;
		}

		if (parameterName === 'multiply') {
			return this.mult.gain;
		}

		return accessParameter(this.oscillator, parameterName);
	}

	start(when?: number | undefined): void {
		this.oscillator.start(when);
		this.scalerOn.start(when);
		this.minusOne.start(when);
		this.negateOn.start(when);
	}

	stop(when?: number | undefined): void {
		this.oscillator.stop(when);
		this.scalerOn.stop(when);
		this.minusOne.stop(when);
		this.negateOn.stop(when);
	}
}

export class CustomSineLFONode extends CustomLFONode {
	constructor(id: string) {
		super(id, 'sine');
	}
}

export class CustomSawLFONode extends CustomLFONode {
	constructor(id: string) {
		super(id, 'sawtooth');
	}
}

export class CustomTriangleLFONode extends CustomLFONode {
	constructor(id: string) {
		super(id, 'triangle');
	}
}

export class CustomSquareLFONode extends CustomLFONode {
	constructor(id: string) {
		super(id, 'square');
	}
}

export class MidiNode extends GenericCustomAudioNode {
	private midiAccess: MIDIAccess | null = null;

	readonly frequency: ConstantSourceNode;
	readonly trigger: ConstantSourceNode;

	constructor(id: string) {
		super(id, 'midi');

		const frequency = globalContext.createConstantSource();
		const trigger = globalContext.createConstantSource();

		this.frequency = frequency;
		this.trigger = trigger;
	}

	getAudioParam(): AudioParam {
		throw new Error('MidiNode does not have any parameters');
	}

	getInputNode(): AudioNode | null {
		return null;
	}

	getOutputNode(name?: string): AudioNode {
		if (name === 'trigger') {
			return this.trigger;
		}

		return this.frequency;
	}

	start(): void {
		navigator.requestMIDIAccess().then((midiAccess) => {
			this.midiAccess = midiAccess;

			this.midiAccess.inputs.forEach((input) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				input.addEventListener('midimessage', this.handleMidiMessage.bind(this) as any);
			});
		});
	}

	stop(): void {
		if (this.midiAccess !== null) {
			this.midiAccess.inputs.forEach((input) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				input.removeEventListener('midimessage', this.handleMidiMessage.bind(this) as any);
			});
		}
	}

	private handleMidiMessage(event: MIDIMessageEvent) {
		const status = event.data?.[0] ?? 0;
		const note = event.data?.[1] ?? 0;

		if (status === 144) {
			this.trigger.offset.value = 1;
		}

		if (status === 128) {
			this.trigger.offset.value = 0;
		}

		if (note) {
			const freq = midiNoteToFrequency(note);
			this.frequency.offset.value = freq;
		}
	}
}
