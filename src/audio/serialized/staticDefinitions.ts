import type { AllowedSerializedAudioElements } from './types';

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
		inputs: [],
		outputs: ['frequency', 'trigger'],
		parameters: {}
	},
	oscillator: {
		inputs: [],
		outputs: ['audio'],
		parameters: {
			frequency: {
				minValue: 0,
				maxValue: 10000,
				unit: 'Hz',
				defaultValue: 440
			},
			detune: {
				minValue: -4800,
				maxValue: 4800,
				unit: 'cents',
				defaultValue: 0
			}
		}
	},
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
				maxValue: 4800,
				unit: 'ms',
				defaultValue: 0
			},
			decay: {
				minValue: 0,
				maxValue: 4800,
				unit: 'ms',
				defaultValue: 200
			},
			sustain: {
				minValue: 0,
				maxValue: 1,
				defaultValue: 0
			},
			release: {
				minValue: 0,
				maxValue: 4800,
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
