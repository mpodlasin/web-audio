import { globalContext } from '../GlobalContext';
import { settings } from '../settings';
import { generateReverb } from '../web-audio/reverbGeneration';
import {
	isCustomAudioNodeWithWebApiNode,
	type CustomAudioNode,
	type CustomAudioNodeWithWebApiNode,
	type CustomAudioScheduledSourceNode,
	isCustomAudioScheduledSourceNode,
	type CustomAudioParam,
	isCustomAudioParam
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

		if (isCustomAudioParam(destination)) {
			this.getOutputNode().connect(destination.getMultiplierForInput(this.id));

			return;
		}

		if (isCustomAudioNodeWithWebApiNode(destination)) {
			this.getOutputNode().connect(destination.webApiNode);
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

export class CustomBipolarToUnipolarNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor(id: string) {
		super(new AudioWorkletNode(globalContext, 'scaler'), id);
	}
}

export class CustomLowpassFilterNode extends GenericCustomAudioNodeWithWebApiNode<BiquadFilterNode> {
	constructor(id: string) {
		const filter = globalContext.createBiquadFilter();
		filter.type = 'lowpass';
		super(filter, id);
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

export class CustomConvolutionNode extends GenericCustomAudioNodeWithWebApiNode<ConvolverNode> {
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

	constructor(id: string) {
		super(globalContext.createConvolver(), id);

		CustomConvolutionNode.fetchReverb(this.webApiNode);
	}
}

export class CustomDelayNode extends GenericCustomAudioNodeWithWebApiNode<DelayNode> {
	constructor(id: string) {
		super(globalContext.createDelay(), id);
	}
}

export type Destination = CustomAudioNode | AudioParam;

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
