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

export class GenericCustomAudioNodeWithWebApiNode<T extends AudioNode>
	implements CustomAudioNodeWithWebApiNode<T>
{
	readonly webApiNode: T;

	constructor(webApiNode: T) {
		this.webApiNode = webApiNode;
	}

	private parameterAnalysers: { [parameterName: string]: AnalyserNode } = {};
	private parameterMultipliers: { [parameterName: string]: GainNode } = {};

	getParameter(parameterName: string): CustomAudioParam {
		const audioParam = accessParameter(this.webApiNode, parameterName);

		if (!this.parameterAnalysers[parameterName]) {
			this.parameterAnalysers[parameterName] = globalContext.createAnalyser();
		}

		if (!this.parameterMultipliers[parameterName]) {
			this.parameterMultipliers[parameterName] = globalContext.createGain();
			this.parameterMultipliers[parameterName]?.connect(audioParam);
		}

		const analyser = this.parameterAnalysers[parameterName];
		const multiplier = this.parameterMultipliers[parameterName];

		if (!analyser) throw new Error();
		if (!multiplier) throw new Error();

		return {
			audioParam,
			analyser,
			multiplier
		};
	}

	connect(destination: CustomAudioNode | AudioParam | CustomAudioParam): void {
		if (destination instanceof AudioParam) {
			this.webApiNode.connect(destination);

			return;
		}

		if (isCustomAudioParam(destination)) {
			this.webApiNode.connect(destination.analyser);
			this.webApiNode.connect(destination.multiplier);

			return;
		}

		if (isCustomAudioNodeWithWebApiNode(destination)) {
			this.webApiNode.connect(destination.webApiNode);
		}
	}

	disconnect(destination: CustomAudioNode | AudioParam | CustomAudioParam): void {
		if (destination instanceof AudioParam) {
			this.webApiNode.disconnect(destination);

			return;
		}

		if (isCustomAudioParam(destination)) {
			this.webApiNode.disconnect(destination.multiplier);
			this.webApiNode.disconnect(destination.analyser);

			return;
		}

		if (isCustomAudioNodeWithWebApiNode(destination)) {
			this.webApiNode.disconnect(destination.webApiNode);
		}
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

export class CustomSineOscillatorNode extends CustomAudioNodeWithWebApiAudioScheduledSourceNode<OscillatorNode> {
	constructor() {
		const oscillator = globalContext.createOscillator();
		oscillator.type = 'sine';
		super(oscillator);
	}
}

export class CustomSawOscillatorNode extends CustomAudioNodeWithWebApiAudioScheduledSourceNode<OscillatorNode> {
	constructor() {
		const oscillator = globalContext.createOscillator();
		oscillator.type = 'sawtooth';
		super(oscillator);
	}
}

export class CustomSquareOscillatorNode extends CustomAudioNodeWithWebApiAudioScheduledSourceNode<OscillatorNode> {
	constructor() {
		const oscillator = globalContext.createOscillator();
		oscillator.type = 'square';
		super(oscillator);
	}
}

export class CustomTriangleOscillatorNode extends CustomAudioNodeWithWebApiAudioScheduledSourceNode<OscillatorNode> {
	constructor() {
		const oscillator = globalContext.createOscillator();
		oscillator.type = 'triangle';
		super(oscillator);
	}
}

export class CustomPanNode extends GenericCustomAudioNodeWithWebApiNode<StereoPannerNode> {
	constructor() {
		super(globalContext.createStereoPanner());
	}
}

export class CustomBipolarToUnipolarNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor() {
		super(new AudioWorkletNode(globalContext, 'scaler'));
	}
}

export class CustomLowpassFilterNode extends GenericCustomAudioNodeWithWebApiNode<BiquadFilterNode> {
	constructor() {
		const filter = globalContext.createBiquadFilter();
		filter.type = 'lowpass';
		super(filter);
	}
}

export class CustomGainNode extends GenericCustomAudioNodeWithWebApiNode<GainNode> {
	constructor() {
		super(globalContext.createGain());
	}
}

export class CustomMultiplyNode extends GenericCustomAudioNodeWithWebApiNode<GainNode> {
	constructor() {
		super(globalContext.createGain());
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
	constructor() {
		super(globalContext.createAnalyser());
	}
}

export class AREnvelopeNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor() {
		super(new AudioWorkletNode(globalContext, 'ar-envelope'));
	}
}

export class SequencerNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor() {
		super(new AudioWorkletNode(globalContext, 'sequencer'));
	}
}

export class PitchQuantizerNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor() {
		super(new AudioWorkletNode(globalContext, 'pitch-quantizer'));
	}
}

export class TriggerNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor() {
		super(new AudioWorkletNode(globalContext, 'trigger'));
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
	constructor() {
		super(globalContext.destination);
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

	constructor() {
		super(globalContext.createConvolver());

		CustomConvolutionNode.fetchReverb(this.webApiNode);
	}
}

export class CustomDelayNode extends GenericCustomAudioNodeWithWebApiNode<DelayNode> {
	constructor() {
		super(globalContext.createDelay());
	}
}

export type Destination = CustomAudioNode | AudioParam;

export class MidiNode {
	private frequencyDestinations: Destination[] = [];
	private triggerDestinations: Destination[] = [];
	private midiAccess: MIDIAccess | null = null;

	getParameter(parameterName: string): CustomAudioParam {
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
				input.addEventListener('midimessage', this.handleMidiMessage.bind(this) as any);
			});
		});
	}

	stop(): void {
		if (this.midiAccess !== null) {
			this.midiAccess.inputs.forEach((input) => {
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
