import { globalContext } from '../GlobalContext';
import { allowedSerializedAudioElementStaticDefinitions, type NodeType } from '../serialized';
import { generateReverb } from '../web-audio/reverbGeneration';
import {
	createAdEnvelopeWorklet,
	createClockCounterWorklet,
	createGateLengthWorklet,
	createGreaterThanWorklet,
	createMeasureGateWorklet,
	createMinMaxWorklet,
	createPatternWorklet,
	createPitchQuantizerWorklet,
	createSawOscillatorWorklet,
	createScalerWorklet,
	createSequencerWorklet,
	createSquareOscillatorWorklet,
	createTimesWorklet
} from '../web-audio/utils';
import {
	type CustomAudioNode,
	type CustomAudioNodeWithWebApiNode,
	type CustomAudioParam,
	isCustomAudioParam,
	isCustomAudioNode,
	type Output,
	type Destination,
	type Input,
	isInput
} from './types';
import { accessParameter } from './update';
import { midiNoteToFrequency } from './utils';

abstract class GenericCustomAudioNode implements CustomAudioNode {
	constructor(private id: string, protected type: NodeType) {}

	private parameterInputs: { [parameterName: string]: ConstantSourceNode } = {};
	private parameterAnalysers: { [parameterName: string]: AnalyserNode } = {};
	private parameterLimiters: { [parameterName: string]: AudioWorkletNode } = {};
	private parameterMultipliers: {
		[parameterName: string]: {
			[inputId: string]: GainNode;
		};
	} = {};

	abstract getOutputNode(name?: string): AudioNode;

	abstract getAudioParam(parameterName: string): AudioParam;

	abstract getInputNode(): AudioNode | null;

	abstract cleanup(): void;

	getInput(name?: string): Input | null {
		const inputNode = this.getInputNode();

		if (inputNode === null) return null;

		const staticDefinition = allowedSerializedAudioElementStaticDefinitions[this.type];
		const inputNodeIndex = staticDefinition.inputs.findIndex((el) => el.id === name);
		const inputIndex = inputNodeIndex === -1 ? 0 : inputNodeIndex;

		return {
			getNode() {
				return inputNode;
			},
			getInputIndex() {
				return inputIndex;
			}
		};
	}

	getOutput(name?: string): Output {
		const id = this.id;
		const outputNode = this.getOutputNode(name);

		const staticDefinition = allowedSerializedAudioElementStaticDefinitions[this.type];
		const outputNodeIndex = staticDefinition.outputs.findIndex((el) => el.id === name);
		const outputIndex = outputNodeIndex === -1 ? 0 : outputNodeIndex;

		return {
			connect(destination: Destination) {
				if (isCustomAudioNode(destination)) {
					const inputNode = destination.getInput()?.getNode();
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

				if (isInput(destination)) {
					const inputNode = destination.getNode();
					const inputIndex = destination.getInputIndex();

					if (inputIndex === 0 && outputIndex === 0) {
						outputNode.connect(inputNode);
					} else {
						outputNode.connect(inputNode, outputIndex, inputIndex);
					}
					return;
				}

				outputNode.connect(destination);
			},

			disconnect(destination: Destination) {
				if (destination instanceof AudioParam) {
					outputNode.disconnect(destination);
					return;
				}

				if (isCustomAudioParam(destination)) {
					outputNode.disconnect(destination.getMultiplierForInput(id));
					return;
				}

				if (isCustomAudioNode(destination)) {
					const inputNode = destination.getInput()?.getNode();

					if (inputNode) {
						outputNode.disconnect(inputNode);
					}

					return;
				}

				if (isInput(destination)) {
					const inputNode = destination.getNode();
					outputNode.disconnect(inputNode);

					return;
				}

				outputNode.disconnect(destination);
				return;
			}
		};
	}

	getParameter(parameterName: string): CustomAudioParam {
		const audioParam = this.getAudioParam(parameterName);

		if (!this.parameterInputs[parameterName]) {
			const parameterInput = globalContext.createConstantSource();
			parameterInput.start();

			this.parameterInputs[parameterName] = parameterInput;
		}

		const parameterInput = this.parameterInputs[parameterName];

		if (!parameterInput) throw new Error('No parameterInput!');

		if (!this.parameterAnalysers[parameterName]) {
			const analyser = globalContext.createAnalyser();
			this.parameterAnalysers[parameterName] = analyser;
		}

		const analyser = this.parameterAnalysers[parameterName];

		if (!analyser) throw new Error('No analyser!');

		if (!this.parameterLimiters[parameterName]) {
			const staticDefinition = allowedSerializedAudioElementStaticDefinitions[this.type];

			const limiter = createMinMaxWorklet();

			this.parameterLimiters[parameterName] = limiter;

			const minParameter = limiter.parameters.get('min');
			const maxParameter = limiter.parameters.get('max');

			if (minParameter && maxParameter) {
				minParameter.value = staticDefinition.parameters[parameterName]?.minValue ?? 0;
				maxParameter.value = staticDefinition.parameters[parameterName]?.maxValue ?? 0;
			}

			parameterInput.connect(limiter).connect(audioParam);
			audioParam.value = 0;
		}

		const limiter = this.parameterLimiters[parameterName];

		if (!limiter) throw new Error('No limiter!');

		return {
			audioParam: parameterInput.offset,
			analyser,
			getMultiplierForInput: (inputId: string) => {
				if (!this.parameterMultipliers[parameterName]) {
					this.parameterMultipliers[parameterName] = {};
				}

				const multipliersForParameter = this.parameterMultipliers[parameterName];

				if (!multipliersForParameter) throw new Error();

				if (!multipliersForParameter[inputId]) {
					const multiplier = globalContext.createGain();
					multiplier.gain.value = 1;

					multiplier.connect(parameterInput.offset);
					multiplier.connect(analyser);

					multipliersForParameter[inputId] = multiplier;
				}

				const multiplierForParameterAndInputId = multipliersForParameter[inputId];

				if (!multiplierForParameterAndInputId) throw new Error();

				return multiplierForParameterAndInputId;
			}
		};
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

	cleanup(): void {
		this.webApiNode.disconnect();
	}
}

export class CustomOscillatorNode extends GenericCustomAudioNode {
	readonly output: GainNode;
	readonly leftOscillator: OscillatorNode;
	readonly rightOscillator: OscillatorNode;
	readonly frequency: ConstantSourceNode;
	readonly detune: ConstantSourceNode;
	readonly leftPan: StereoPannerNode;
	readonly rightPan: StereoPannerNode;
	readonly gain: GainNode;
	readonly minusOne: GainNode;

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
		this.leftPan = leftPan;
		this.rightPan = rightPan;
		this.minusOne = minusOne;
		this.gain = gain;

		this.detune.start();
		this.frequency.start();
		this.rightOscillator.start();
		this.leftOscillator.start();
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

	cleanup(): void {
		this.detune.stop();
		this.frequency.stop();
		this.rightOscillator.stop();
		this.leftOscillator.stop();

		this.output.disconnect();
		this.frequency.disconnect();
		this.detune.disconnect();
		this.rightOscillator.disconnect();
		this.leftOscillator.disconnect();
		this.leftPan.disconnect();
		this.rightPan.disconnect();
		this.minusOne.disconnect();
		this.gain.disconnect();
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

export class CustomGreaterThanNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(createGreaterThanWorklet(), id, 'greater-than');
	}
}

export class CustomTimesNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(createTimesWorklet(), id, 'times');
	}
}

export class CustomGateLengthNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(createGateLengthWorklet(), id, 'gate-length');
	}
}

export class CustomBipolarToUnipolarNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(createScalerWorklet(), id, 'bipolar-to-unipolar');
	}
}

export class EmptyCustomAudioNode implements CustomAudioNode {
	getOutput(): Output {
		throw new Error('Method not implemented.');
	}
	getInput(): Input | null {
		throw new Error('Input not implemented!');
	}
	getInputNode(): AudioNode | null {
		throw new Error('Method not implemented.');
	}
	getParameter(): CustomAudioParam {
		throw new Error('Method not implemented.');
	}
	cleanup() {
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

	getAudioParam(parameterName: string) {
		if (parameterName === 'resonance') {
			return super.getAudioParam('Q');
		}

		return super.getAudioParam(parameterName);
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

export class CustomSpectrumNode extends GenericCustomAudioNodeWithWebApiNode<AnalyserNode> {
	constructor(id: string) {
		super(globalContext.createAnalyser(), id, 'spectrum');
	}
}


export class CustomValueNode extends GenericCustomAudioNodeWithWebApiNode<AnalyserNode> {
	constructor(id: string) {
		super(globalContext.createAnalyser(), id, 'value');
	}
}

export class CustomNumberNode extends GenericCustomAudioNodeWithWebApiNode<ConstantSourceNode> {
	constructor(id: string) {
		const node = globalContext.createConstantSource();

		node.start();

		super(node, id, 'number');
	}

	getAudioParam(parameterName: string): AudioParam {
		if (parameterName === 'value') {
			return this.webApiNode.offset;
		}

		throw new Error(`Parameter ${parameterName} does not exist on Number node`);
	}
}

export class ADEnvelopeNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(createAdEnvelopeWorklet(), id, 'ad-envelope');
	}
}

export class PitchQuantizerNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(createPitchQuantizerWorklet(), id, 'pitch-quantizer');
	}
}

export class MeasureGateNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(createMeasureGateWorklet(), id, 'measure-gate');
	}
}

export class GenericCustomAudioNodeWithWebApiNodeWithTriggerHighlight extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	private counterAnalyser: AnalyserNode;
	private input: GainNode;

	constructor(node: AudioWorkletNode, id: string, type: NodeType) {
		const counter = createClockCounterWorklet();
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
		super(createSequencerWorklet(), id, 'sequencer');
	}
}

export class CustomPatternNode extends GenericCustomAudioNodeWithWebApiNodeWithTriggerHighlight {
	constructor(id: string) {
		super(createPatternWorklet(), id, 'pattern');
	}
}

export class ClockNode extends GenericCustomAudioNode implements CustomAudioNode {
	private gateLength: AudioNode;
	private tempo: ConstantSourceNode;
	private squareOscillator: AudioNode;
	private scaler: AudioNode;
	private bpmToFrequencyGain: GainNode;

	constructor(id: string) {
		super(id, 'clock');

		const squareOscillator = createSquareOscillatorWorklet();
		const scaler = createScalerWorklet();
		const gateLength = createGateLengthWorklet();
		const tempo = globalContext.createConstantSource();
		const bpmToFrequencyGain = globalContext.createGain();

		bpmToFrequencyGain.gain.value = (1 / 60) * 4;

		tempo.connect(bpmToFrequencyGain);
		const frequency = squareOscillator.parameters.get('frequency');
		if (frequency) {
			bpmToFrequencyGain.connect(frequency);
		}

		squareOscillator.connect(scaler);
		scaler.connect(gateLength);

		this.gateLength = gateLength;
		this.tempo = tempo;
		this.squareOscillator = squareOscillator;
		this.scaler = scaler;
		this.bpmToFrequencyGain = bpmToFrequencyGain;

		tempo.start();
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

	cleanup(): void {
		this.tempo.stop();

		this.gateLength.disconnect();
		this.tempo.disconnect();
		this.squareOscillator.disconnect();
		this.scaler.disconnect();
		this.bpmToFrequencyGain.disconnect();
	}
}

export class DestinationNode extends GenericCustomAudioNode implements CustomAudioNode {
	private audioDesinationNode: AudioDestinationNode;
	private gainNode: GainNode;

	constructor(id: string) {
		super(id, 'destination');

		this.audioDesinationNode = globalContext.destination;
		this.gainNode = globalContext.createGain();

		this.gainNode.connect(this.audioDesinationNode);
	}

	getAudioParam(parameterName: string): AudioParam {
		if (parameterName === 'volume') {
			return this.gainNode.gain;
		}

		throw new Error(`Parmeter ${parameterName} does not exist on Destination node`);
	}

	getInputNode(): AudioNode | null {
		return this.gainNode;
	}

	getOutputNode(): AudioNode {
		return this.audioDesinationNode;
	}

	cleanup(): void {
		this.gainNode.disconnect();
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
	private wetGain: GainNode;
	private dryGain: GainNode;

	constructor(id: string) {
		super(id, 'convolution');

		const convolution = globalContext.createConvolver();

		CustomConvolutionNode.fetchReverb(convolution);

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
		this.dryGain = dryGain;
		this.wetGain = wetGain;

		mix.start();
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
	cleanup(): void {
		this.mix.stop();

		this.mix.disconnect();
		this.input.disconnect();
		this.convolution.disconnect();
		this.output.disconnect();
		this.dryGain.disconnect();
		this.wetGain.disconnect();
	}
}

export class CustomDelayNode extends GenericCustomAudioNode {
	private input: GainNode;
	private delay: DelayNode;
	private feedbackGain: GainNode;
	private output: GainNode;
	private mix: ConstantSourceNode;
	private measureTrigger: AudioWorkletNode;
	private dryGain: GainNode;
	private wetGain: GainNode;

	constructor(id: string) {
		super(id, 'delay');
		const delayMaxValue =
			allowedSerializedAudioElementStaticDefinitions['delay'].parameters['delayTime']?.maxValue;
		const delay = globalContext.createDelay(delayMaxValue);

		const measureTrigger = createMeasureGateWorklet();

		const mix = globalContext.createConstantSource();
		const negate = globalContext.createGain();
		const feedbackGain = globalContext.createGain();
		const input = globalContext.createGain();
		const output = globalContext.createGain();
		const dryGain = globalContext.createGain();
		const wetGain = globalContext.createGain();

		measureTrigger.connect(delay.delayTime);

		input.gain.value = 1;
		output.gain.value = 1;

		negate.gain.value = -1;

		dryGain.gain.value = 1;
		wetGain.gain.value = 0;

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
		this.measureTrigger = measureTrigger;
		this.wetGain = wetGain;
		this.dryGain = dryGain;

		mix.start();
	}

	getInputNode(name?: string): AudioNode | null {
		if (name === 'trigger') {
			return this.measureTrigger;
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

	cleanup(): void {
		this.mix.stop();

		this.mix.disconnect();
		this.input.disconnect();
		this.delay.disconnect();
		this.feedbackGain.disconnect();
		this.output.disconnect();
		this.measureTrigger.disconnect();
		this.wetGain.disconnect();
		this.dryGain.disconnect();
	}
}

export class CustomLFONode extends GenericCustomAudioNode {
	private mult: GainNode;
	private scalerOn: ConstantSourceNode;
	private minusOne: ConstantSourceNode;
	private invertOn: ConstantSourceNode;
	private negate: GainNode;
	private timesMinusTwo: GainNode;

	constructor(id: string, nodeType: NodeType, private oscillator: AudioNode) {
		super(id, nodeType);

		const mult = globalContext.createGain();
		const negate = globalContext.createGain();
		const timesMinusTwo = globalContext.createGain();
		const invertOn = globalContext.createConstantSource();

		invertOn.connect(timesMinusTwo).connect(negate.gain);

		timesMinusTwo.gain.value = -2;
		negate.gain.value = 1;

		const scaler = createScalerWorklet();
		const scalerOn = globalContext.createConstantSource();
		const minusOne = globalContext.createConstantSource();
		minusOne.offset.value = -1;
		scalerOn.offset.value = 0;

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
		this.invertOn = invertOn;
		this.negate = negate;
		this.timesMinusTwo = timesMinusTwo;

		this.scalerOn.start();
		this.invertOn.start();
		this.minusOne.start();
	}

	getInputNode(): AudioNode | null {
		return this.oscillator;
	}

	getOutputNode(): AudioNode {
		return this.mult;
	}

	getAudioParam(parameterName: string): AudioParam {
		if (parameterName === 'invert') {
			return this.invertOn.offset;
		}

		if (parameterName === 'unipolar') {
			return this.scalerOn.offset;
		}

		if (parameterName === 'multiply') {
			return this.mult.gain;
		}

		return accessParameter(this.oscillator, parameterName);
	}

	cleanup(): void {
		this.scalerOn.stop();
		this.invertOn.stop();
		this.minusOne.stop();

		this.oscillator.disconnect();
		this.mult.disconnect();
		this.scalerOn.disconnect();
		this.minusOne.disconnect();
		this.invertOn.disconnect();
		this.negate.disconnect();
		this.timesMinusTwo.disconnect();
	}
}

export class CustomSineLFONode extends CustomLFONode {
	constructor(id: string) {
		const oscillator = globalContext.createOscillator();
		oscillator.type = 'sine';
		oscillator.start();
		super(id, 'sine-lfo', oscillator);
	}
}

export class CustomSawLFONode extends CustomLFONode {
	constructor(id: string) {
		const oscillator = createSawOscillatorWorklet();
		super(id, 'saw-lfo', oscillator);
	}
}

export class CustomTriangleLFONode extends CustomLFONode {
	constructor(id: string) {
		const oscillator = globalContext.createOscillator();
		oscillator.type = 'triangle';
		oscillator.start();
		super(id, 'triangle-lfo', oscillator);
	}
}

export class CustomSquareLFONode extends CustomLFONode {
	constructor(id: string) {
		const oscillator = createSquareOscillatorWorklet();
		super(id, 'square-lfo', oscillator);
	}
}

export class MidiNode extends GenericCustomAudioNode {
	private midiAccess: MIDIAccess | null = null;

	readonly frequency: ConstantSourceNode;
	readonly gate: ConstantSourceNode;

	constructor(id: string) {
		super(id, 'midi');

		const frequency = globalContext.createConstantSource();
		const gate = globalContext.createConstantSource();

		this.frequency = frequency;
		this.gate = gate;

		this.frequency.start();
		this.gate.start();

		navigator.requestMIDIAccess().then((midiAccess) => {
			this.midiAccess = midiAccess;

			this.midiAccess.inputs.forEach((input) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				input.addEventListener('midimessage', this.handleMidiMessage.bind(this) as any);
			});
		});
	}

	getAudioParam(): AudioParam {
		throw new Error('MidiNode does not have any parameters');
	}

	getInputNode(): AudioNode | null {
		return null;
	}

	getOutputNode(name?: string): AudioNode {
		if (name === 'gate') {
			return this.gate;
		}

		return this.frequency;
	}

	cleanup(): void {
		if (this.midiAccess !== null) {
			this.midiAccess.inputs.forEach((input) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				input.removeEventListener('midimessage', this.handleMidiMessage.bind(this) as any);
			});
		}

		this.frequency.stop();
		this.gate.stop();

		this.frequency.disconnect();
		this.gate.disconnect();
	}

	private handleMidiMessage(event: MIDIMessageEvent) {
		const status = event.data?.[0] ?? 0;
		const note = event.data?.[1] ?? 0;

		if (status === 144) {
			this.gate.offset.value = 1;
		}

		if (status === 128) {
			this.gate.offset.value = 0;
		}

		if (note) {
			const freq = midiNoteToFrequency(note);
			this.frequency.offset.value = freq;
		}
	}
}
