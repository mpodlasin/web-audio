import { globalContext } from '../GlobalContext';
import { allowedSerializedAudioElementStaticDefinitions, plugsEqual } from '../serialized';
import { settings } from '../settings';
import { generateReverb } from '../web-audio/reverbGeneration';
import {
	isCustomAudioNodeWithWebApiNode,
	type CustomAudioNode,
	type CustomAudioNodeWithWebApiNode,
	type CustomAudioScheduledSourceNode,
	isCustomAudioScheduledSourceNode,
	type CustomAudioParam,
	isCustomAudioParam,
	isCustomAudioNode
} from './types';
import { accessParameter } from './update';

abstract class GenericCustomAudioNode implements CustomAudioNode {
	constructor(private id: string) {}

	private parameterAnalysers: { [parameterName: string]: AnalyserNode } = {};
	private parameterMultipliers: {
		[parameterName: string]: {
			[inputId: string]: GainNode;
		};
	} = {};

	abstract getOutputNode(): AudioNode;

	abstract getAudioParam(parameterName: string): AudioParam;

	abstract getInputNode(): AudioNode | null;

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
			this.getOutputNode().connect(destination);

			return;
		}

		if (isCustomAudioNode(destination)) {
			const inputNode = destination.getInputNode();
			if (inputNode) {
				this.getOutputNode().connect(inputNode);
			}
		}

		if (isCustomAudioParam(destination)) {
			this.getOutputNode().connect(destination.getMultiplierForInput(this.id));

			return;
		}
	}

	disconnect(destination: CustomAudioNode | AudioParam | CustomAudioParam | undefined): void {
		if (destination === undefined) {
			this.getOutputNode().disconnect();
			return;
		}

		if (destination instanceof AudioParam) {
			this.getOutputNode().disconnect(destination);

			return;
		}

		if (isCustomAudioParam(destination)) {
			this.getOutputNode().disconnect(destination.getMultiplierForInput(this.id));

			return;
		}

		if (isCustomAudioNodeWithWebApiNode(destination)) {
			this.getOutputNode().disconnect(destination.webApiNode);
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

	constructor(webApiNode: T, id: string) {
		super(id);
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

	constructor(id: string, type: OscillatorType) {
		super(id);

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
		super(globalContext.createStereoPanner(), id);
	}
}

export class CustomGateLengthNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(new AudioWorkletNode(globalContext, 'gate-length'), id);
	}
}

export class CustomBipolarToUnipolarNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(new AudioWorkletNode(globalContext, 'scaler'), id);
	}
}

export class CustomFilterNode extends GenericCustomAudioNodeWithWebApiNode<BiquadFilterNode> {
	constructor(id: string, type: BiquadFilterType) {
		const filter = globalContext.createBiquadFilter();
		filter.type = type;
		super(filter, id);
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
		super(globalContext.createGain(), id);
	}
}

export class CustomMultiplyNode extends GenericCustomAudioNodeWithWebApiNode<GainNode> {
	constructor(id: string) {
		super(globalContext.createGain(), id);
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
	constructor(id: string) {
		super(globalContext.createAnalyser(), id);
	}
}

export class ADEnvelopeNode extends GenericCustomAudioNode implements CustomAudioNode {
	readonly attack: ConstantSourceNode;
	readonly gateLength: AudioWorkletNode;
	readonly arEnvelope: AudioWorkletNode;

	constructor(id: string) {
		super(id);

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
		super(new AudioWorkletNode(globalContext, 'ar-envelope'), id);
	}
}

export class SequencerNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(new AudioWorkletNode(globalContext, 'sequencer'), id);
	}
}

export class PitchQuantizerNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(new AudioWorkletNode(globalContext, 'pitch-quantizer'), id);
	}
}

export class MeasureGateNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(new AudioWorkletNode(globalContext, 'measure-gate'), id);
	}
}

export class CustomPatternNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	private counterAnalyser: AnalyserNode;

	constructor(id: string) {
		const node = new AudioWorkletNode(globalContext, 'pattern');
		const counter = new AudioWorkletNode(globalContext, 'clock-counter');
		const counterAnalyser = globalContext.createAnalyser();

		const modulo = counter.parameters.get('modulo');

		node.connect(counter).connect(counterAnalyser);

		if (modulo) {
			modulo.value = 8;
		}

		const steps = node.parameters.get('steps');
		if (steps) {
			steps.value = 8;
		}

		super(node, id);

		this.counterAnalyser = counterAnalyser;
	}

	lastValue = 0;

	onHighlightParameter(callback: (parameterName: string) => void): void {
		const staticParameters = allowedSerializedAudioElementStaticDefinitions['pattern'].parameters;
		const analyser = this.counterAnalyser;
		analyser.fftSize = 2048;
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Float32Array(bufferLength);

		const highlightParameter = () => {
			analyser.getFloatTimeDomainData(dataArray);
			const value = dataArray[0] ?? 0;

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

export class TriggerNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(new AudioWorkletNode(globalContext, 'trigger'), id);
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
		super(globalContext.destination, id);
	}
}

export class CustomConvolutionNode extends GenericCustomAudioNode {
	static async fetchReverb(convolver: ConvolverNode) {
		generateReverb(
			{
				sampleRate: settings.sampleRate,
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
		super(id);

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

	constructor(id: string) {
		super(id);
		const delayMaxValue =
			allowedSerializedAudioElementStaticDefinitions['delay'].parameters['delayTime']?.maxValue;
		const delay = globalContext.createDelay(delayMaxValue);

		const mix = globalContext.createConstantSource();
		const negate = globalContext.createGain();
		const feedbackGain = globalContext.createGain();
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
	}

	getInputNode(): AudioNode | null {
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

export type Destination = CustomAudioNode | AudioParam;

export class CustomLFONode
	extends GenericCustomAudioNode
	implements CustomAudioScheduledSourceNode
{
	private oscillator: OscillatorNode;
	private mult: GainNode;
	private scalerOn: ConstantSourceNode;
	private minusOne: ConstantSourceNode;
	private negateOn: ConstantSourceNode;

	constructor(id: string, type: OscillatorType) {
		super(id);

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

export class MidiNode {
	private frequencyDestinations: Destination[] = [];
	private triggerDestinations: Destination[] = [];
	private midiAccess: MIDIAccess | null = null;

	getParameter(): CustomAudioParam {
		throw new Error('MidiNode does not have any parameters');
	}

	connect(destination: CustomAudioNode | AudioParam, output: 'frequency' | 'trigger'): void {
		if (output === 'frequency') {
			this.frequencyDestinations.push(destination);
		} else {
			this.triggerDestinations.push(destination);
		}
	}

	disconnect(destination: CustomAudioNode | AudioParam, output: 'frequency' | 'trigger'): void {
		if (output === 'frequency') {
			this.frequencyDestinations = this.frequencyDestinations.filter((d) => d !== destination);
		} else {
			this.triggerDestinations = this.triggerDestinations.filter((d) => d !== destination);
		}
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
		const [status, note] = event.data;

		if (status === 144) {
			this.triggerDestinations.forEach((destination) => {
				if (destination instanceof AudioParam) {
					return;
				}

				if (isCustomAudioScheduledSourceNode(destination)) {
					destination.start(globalContext.currentTime);
				}
			});
		}

		if (status === 128) {
			this.triggerDestinations.forEach((destination) => {
				if (destination instanceof AudioParam) {
					return;
				}

				if (isCustomAudioScheduledSourceNode(destination)) {
					destination.stop(globalContext.currentTime);
				}
			});
		}

		if (note) {
			this.frequencyDestinations.forEach((destination) => {
				if (destination instanceof AudioParam) {
					destination.setValueAtTime(midiNoteToFrequency(note), globalContext.currentTime);
				}
			});
		}
	}
}
