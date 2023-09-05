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
	trigger: {
		inputs: [],
		outputs: ['trigger'],
		parameters: {}
	},
	envelope: {
		inputs: ['trigger'],
		outputs: ['envelope'],
		parameters: {}
	},
	midi: {
		inputs: [],
		outputs: ['frequency', 'trigger'],
		parameters: {}
	}
};
