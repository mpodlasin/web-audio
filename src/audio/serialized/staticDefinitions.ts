import type { AllowedSerializedAudioElements } from './types';

const frequencyParameter = {
	minValue: 0,
	maxValue: 10000,
	unit: 'Hz',
	defaultValue: 440,
	polarity: 'uni' as const
};

const buttonParameter = {
	minValue: 0,
	maxValue: 1,
	defaultValue: 0,
	polarity: 'uni' as const,
	binary: true
};

const oscillatorDefinition = {
	inputs: [],
	outputs: ['audio'],
	parameters: {
		frequency: frequencyParameter,
		detune: {
			minValue: -4800,
			maxValue: 4800,
			unit: 'cents',
			defaultValue: 0,
			polarity: 'bi' as const
		}
	}
};

const filterDefinition = {
	inputs: ['audio'],
	outputs: ['audio'],
	parameters: {
		frequency: frequencyParameter
	}
};

export const allowedSerializedAudioElementStaticDefinitions: {
	[key in AllowedSerializedAudioElements['type']]: {
		inputs: string[];
		outputs: string[];
		parameters: {
			[key: string]: {
				minValue: number;
				maxValue: number;
				unit?: string;
				defaultValue?: number;
				polarity: 'uni' | 'bi';
				binary?: boolean;
				linear?: boolean;
			};
		};
	};
} = {
	sequencer: {
		inputs: ['trigger'],
		outputs: ['frequency'],
		parameters: {
			frequency1: frequencyParameter,
			frequency2: frequencyParameter,
			frequency3: frequencyParameter,
			frequency4: frequencyParameter,
			frequency5: frequencyParameter,
			frequency6: frequencyParameter,
			frequency7: frequencyParameter,
			frequency8: frequencyParameter
		}
	},
	'pitch-quantizer': {
		inputs: ['frequency'],
		outputs: ['frequency'],
		parameters: {
			A: buttonParameter,
			'A#': buttonParameter,
			B: buttonParameter,
			C: buttonParameter,
			'C#': buttonParameter,
			D: buttonParameter,
			'D#': buttonParameter,
			E: buttonParameter,
			F: buttonParameter,
			'F#': buttonParameter,
			G: buttonParameter,
			'G#': buttonParameter
		}
	},
	'sine-oscillator': oscillatorDefinition,
	'saw-oscillator': oscillatorDefinition,
	'square-oscillator': oscillatorDefinition,
	'triangle-oscillator': oscillatorDefinition,
	'lowpass-filter': filterDefinition,
	gain: {
		inputs: ['audio'],
		outputs: ['audio'],
		parameters: {
			gain: {
				minValue: 0,
				maxValue: 1,
				defaultValue: 1,
				polarity: 'uni',
				linear: true
			}
		}
	},
	multiply: {
		inputs: ['audio'],
		outputs: ['audio'],
		parameters: {
			factor: {
				minValue: 0,
				maxValue: 10000,
				defaultValue: 1,
				polarity: 'uni'
			}
		}
	},
	'bipolar-to-unipolar': {
		inputs: ['audio'],
		outputs: ['audio'],
		parameters: {}
	},
	pan: {
		inputs: ['audio'],
		outputs: ['audio'],
		parameters: {
			pan: {
				minValue: -1,
				maxValue: 1,
				defaultValue: 0,
				polarity: 'bi',
				linear: true
			}
		}
	},
	delay: {
		inputs: ['audio'],
		outputs: ['audio'],
		parameters: {
			delayTime: {
				minValue: 0,
				maxValue: 1,
				defaultValue: 0,
				polarity: 'uni'
			}
		}
	},
	destination: {
		inputs: ['audio'],
		outputs: [],
		parameters: {}
	},
	oscilloscope: {
		inputs: ['audio'],
		outputs: ['audio'],
		parameters: {}
	},
	convolution: {
		inputs: ['audio'],
		outputs: ['audio'],
		parameters: {}
	},
	trigger: {
		inputs: [],
		outputs: ['trigger'],
		parameters: {
			tempoInBPM: {
				defaultValue: 120,
				minValue: 0,
				maxValue: 1000,
				unit: 'BPM',
				polarity: 'uni'
			}
		}
	},
	'ar-envelope': {
		inputs: ['trigger'],
		outputs: ['envelope'],
		parameters: {
			attack: {
				minValue: 0,
				maxValue: 5 * 1000,
				unit: 'ms',
				defaultValue: 0,
				polarity: 'uni'
			},
			release: {
				minValue: 0,
				maxValue: 5 * 1000,
				unit: 'ms',
				defaultValue: 200,
				polarity: 'uni'
			}
		}
	},
	midi: {
		inputs: [],
		outputs: ['frequency', 'trigger'],
		parameters: {}
	}
};

export const nodeTypes = Object.keys(
	allowedSerializedAudioElementStaticDefinitions
) as (keyof typeof allowedSerializedAudioElementStaticDefinitions)[];

export const readableNames: { [P in AllowedSerializedAudioElements['type']]: string } = {
	'sine-oscillator': 'Sine',
	'square-oscillator': 'Square',
	'saw-oscillator': 'Saw',
	'triangle-oscillator': 'Triangle',
	'ar-envelope': 'AR',
	'bipolar-to-unipolar': 'Bi -> Uni',
	convolution: 'Convolution',
	delay: 'Delay',
	destination: 'Output',
	gain: 'Gain',
	'lowpass-filter': 'Lowpass',
	midi: 'MIDI',
	multiply: 'Mult',
	oscilloscope: 'Oscilloscope',
	pan: 'Pan',
	'pitch-quantizer': 'Pitch Quantizer',
	sequencer: 'Sequencer',
	trigger: 'Trigger'
};

export const categorizedNodeTypes = {
	oscillators: ['sine-oscillator', 'saw-oscillator', 'square-oscillator', 'triangle-oscillator'],
	gain: ['gain', 'pan'],
	envelope: ['ar-envelope'],
	effects: ['lowpass-filter', 'convolution', 'delay'],
	pitch: ['sequencer', 'pitch-quantizer'],
	math: ['multiply', 'bipolar-to-unipolar'],
	io: ['destination', 'midi'],
	clock: ['trigger'],
	visualization: ['oscilloscope']
};

const everyNodeIsIncludedInMenu = nodeTypes.every((nodeType) =>
	Object.values(categorizedNodeTypes).some((category) =>
		category.some((nodeTypeInCategory) => nodeTypeInCategory === nodeType)
	)
);

if (!everyNodeIsIncludedInMenu) {
	throw Error('AAAAAaaaaaa!!!!!!');
}

const readableCategoryNames: { [P in keyof typeof categorizedNodeTypes]: string } = {
	oscillators: 'Oscillators',
	gain: 'Gain',
	envelope: 'Envelope',
	effects: 'Effects',
	pitch: 'Pitch',
	math: 'Math',
	io: 'I/O',
	clock: 'Clock',
	visualization: 'Visualization'
};
