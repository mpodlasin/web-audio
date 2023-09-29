import type { AllowedSerializedAudioElements } from './types';

const frequencyParameter = {
	minValue: 0,
	maxValue: 10000,
	unit: 'Hz',
	defaultValue: 440
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
		frequency: frequencyParameter,
	},
}

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
