import { globalContext } from '../GlobalContext';
import type { SerializedSequencerNote } from '../serialized';
import { settings } from '../settings';
import { generateReverb } from '../web-audio/reverbGeneration';
import {
	isCustomAudioNodeWithWebApiNode,
	type CustomAudioNode,
	type CustomAudioNodeWithWebApiNode,
	type CustomAudioScheduledSourceNode,
	isCustomAudioScheduledSourceNode
} from './types';

export class GenericCustomAudioNodeWithWebApiNode<T extends AudioNode>
	implements CustomAudioNodeWithWebApiNode<T>
{
	readonly webApiNode: T;
	private desinations: CustomAudioNode[] = [];

	constructor(webApiNode: T) {
		this.webApiNode = webApiNode;
	}

	connect(destination: CustomAudioNode | AudioParam): void {
		if (destination instanceof AudioParam) {
			this.webApiNode.connect(destination);
			return;
		}

		if (isCustomAudioNodeWithWebApiNode(destination)) {
			this.webApiNode.connect(destination.webApiNode);
		}

		this.desinations.push(destination);
	}

	disconnect(destination: CustomAudioNode | AudioParam): void {
		if (destination instanceof AudioParam) {
			this.webApiNode.disconnect(destination);
			return;
		}

		if (isCustomAudioNodeWithWebApiNode(destination)) {
			this.webApiNode.disconnect(destination.webApiNode);
		}

		this.desinations = this.desinations.filter((d) => d !== destination);
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

export class CustomOscilloscopeNode extends GenericCustomAudioNodeWithWebApiNode<AnalyserNode> {
	constructor() {
		super(globalContext.createAnalyser());
	}
}

export class EnvelopeNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor() {
		super(new AudioWorkletNode(globalContext, 'envelope'));
	}
}

export class SequencerNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor() {
		super(new AudioWorkletNode(globalContext, 'sequencer'));
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
				sampleRate: 48000,
				decayTime: 10
			},
			async (response) => {
				convolver.buffer = response;
			}
		);
	}

	constructor() {
		super(globalContext.createConvolver());

		CustomConvolutionNode.fetchReverb(this.webApiNode);
	}
}

export type Destination = CustomAudioNode | AudioParam;

export class MidiNode {
	private frequencyDestinations: Destination[] = [];
	private triggerDestinations: Destination[] = [];
	private midiAccess: MIDIAccess | null = null;

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
