export type SerializedAudioElements = {
	[key: string]: AllowedSerializedAudioElements;
};

export type SerializedAudioElementsWithIds = {
	[key: string]: SerializedAudioElementWithId<AllowedSerializedAudioElements['type'], string>;
};

export type SerializedAudioElement<
	T extends AllowedSerializedAudioElements['type'],
	P extends string
> = {
	type: T;
	inputs?: Inputs;
	parameters?: {
		[key in P]: SerializedAudioParameter;
	} & {
		[key: string]: SerializedAudioParameter;
	};
	ui?: UIInformation;
};

export type Position = {
	x: number;
	y: number;
};

export type UIInformation = {
	position: Position;
};

export type SerializedAudioElementWithId<
	T extends AllowedSerializedAudioElements['type'],
	P extends string
> = SerializedAudioElement<T, P> & {
	id: string;
};

export type Inputs = (string | { id: string; output: string })[];

export type SerializedAudioParameter = {
	base: number;
	inputs: { id: string; output: string }[];
};

export type SerializedSineOscillatorNode = SerializedAudioElement<
	'sine-oscillator',
	'frequency' | 'detune'
>;

export type SerializedSawOscillatorNode = SerializedAudioElement<
	'saw-oscillator',
	'frequency' | 'detune'
>;

export type SerializedSquareOscillatorNode = SerializedAudioElement<
	'square-oscillator',
	'frequency' | 'detune'
>;

export type SerializedTriangleOscillatorNode = SerializedAudioElement<
	'triangle-oscillator',
	'frequency' | 'detune'
>;

export type SerializedLowpassFilterNode = SerializedAudioElement<'lowpass-filter', 'frequency'>;

export type SerializedGainNode = SerializedAudioElement<'gain', 'gain'>;

export type SerializedDestinationNode = SerializedAudioElement<'destination', never>;

export type SerializedTriggerNode = SerializedAudioElement<'trigger', never> & {
	tempoInBpm: number;
};

export type SerializedSequencerNode = SerializedAudioElement<'sequencer', never> & {
	tempoInBpm: number;
	notes: SerializedSequencerNote[];
	loopLength: number;
};

export type SerializedMidiNode = SerializedAudioElement<'midi', never>;

export type SerializedSequencerNote = {
	note: string;
	time: number;
	duration: number;
};

export type SerializedEnvelopeNode = SerializedAudioElement<'envelope', never> & {
	attack: number;
	decay: number;
	sustain: number;
	release: number;
};

export type SerializedOscilloscopeNode = SerializedAudioElement<'oscilloscope', never>;

export type SerializedConvolutionNode = SerializedAudioElement<'convolution', never>;

export type SerializedDelayNode = SerializedAudioElement<'delay', 'delayTime'>;

export type SerializedPitchQuantizerNode = SerializedAudioElement<'pitch-quantizer', never>;

export type AllowedSerializedAudioElements =
	| SerializedSineOscillatorNode
	| SerializedSawOscillatorNode
	| SerializedTriangleOscillatorNode
	| SerializedSquareOscillatorNode
	| SerializedLowpassFilterNode
	| SerializedGainNode
	| SerializedDestinationNode
	| SerializedTriggerNode
	| SerializedEnvelopeNode
	| SerializedSequencerNode
	| SerializedMidiNode
	| SerializedOscilloscopeNode
	| SerializedConvolutionNode
	| SerializedDelayNode
	| SerializedPitchQuantizerNode;
