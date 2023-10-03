import type { AllowedSerializedAudioElements } from './types';

const frequencyParameter = {
	minValue: 0,
	maxValue: 10000,
	unit: 'Hz',
	defaultValue: 440
};

const buttonParameter = {
	minValue: 0,
	maxValue: 1,
	defaultValue: 0
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
			defaultValue: 0
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
				defaultValue: 1
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
				defaultValue: 0
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
				unit: 'BPM'
			}
		}
	},
	envelope: {
		inputs: ['trigger'],
		outputs: ['envelope'],
		parameters: {
			attack: {
				minValue: 0,
				maxValue: 5 * 1000,
				unit: 'ms',
				defaultValue: 0
			},
			release: {
				minValue: 0,
				maxValue: 5 * 1000,
				unit: 'ms',
				defaultValue: 200
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

export const categorizedNodeTypes: {
	[category: string]: AllowedSerializedAudioElements['type'][];
} = {
	oscillators: ['sine-oscillator', 'saw-oscillator', 'square-oscillator', 'triangle-oscillator'],
	gain: ['gain'],
	envelope: ['envelope'],
	visualization: ['oscilloscope'],
	sequencer: ['sequencer'],
	io: ['destination', 'midi']
};
