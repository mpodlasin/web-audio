import { equals } from '../../../utils/equals';
import type { NodeType } from './types';

export type StaticInputOutputDefinition = {
	id: string;
	name: string;
	minValue: number;
	maxValue: number;
	description?: string;
	contextDescription?: string;
	unit?: string;
};

const numberInputOutputDefinition: StaticInputOutputDefinition = {
	id: 'number',
	name: 'Number',
	minValue: -Infinity,
	maxValue: Infinity
};

const audioInputOutputDefinition: StaticInputOutputDefinition = {
	id: 'audio',
	name: 'Audio',
	minValue: -1,
	maxValue: 1
};

const triggerInputOutputDefinition: StaticInputOutputDefinition = {
	id: 'trigger',
	name: 'Trigger',
	minValue: 0,
	maxValue: 1
};

const gateInputOutputDefinition: StaticInputOutputDefinition = {
	id: 'gate',
	name: 'Gate',
	minValue: 0,
	maxValue: 1
};

const frequencyInputOutputDefinition: StaticInputOutputDefinition = {
	id: 'frequency',
	name: 'Frequency',
	minValue: 0,
	maxValue: 10000,
	unit: 'Hz'
};

const envelopeInputOutputDefinition: StaticInputOutputDefinition = {
	id: 'envelope',
	name: 'Envelope',
	minValue: 0,
	maxValue: 1
};

const secondsInputOutputDefinition: StaticInputOutputDefinition = {
	id: 'seconds',
	name: 'Seconds',
	minValue: 0,
	maxValue: 1000,
	unit: 's'
};

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

const lfoDefinition = {
	showCategory: true,
	inputs: [],
	outputs: [
		{
			...numberInputOutputDefinition,
			minValue: -1,
			maxValue: 1,
			contextDescription: 'LFO signal.'
		}
	],
	parameters: {
		frequency: {
			minValue: 0,
			maxValue: 30,
			unit: 'Hz',
			defaultValue: 1,
			polarity: 'uni' as const
		},
		multiply: {
			minValue: 0,
			maxValue: 10000,
			defaultValue: 1,
			polarity: 'uni' as const
		},
		unipolar: buttonParameter,
		invert: buttonParameter
	}
};

const oscillatorDefinition = {
	showCategory: true,
	inputs: [],
	outputs: [audioInputOutputDefinition],
	parameters: {
		frequency: frequencyParameter,
		detune: {
			minValue: -1200,
			maxValue: 1200,
			unit: 'cents',
			defaultValue: 0,
			polarity: 'bi' as const
		}
	}
};

const filterWithResonanceDefinition = {
	showCategory: true,
	inputs: [audioInputOutputDefinition],
	outputs: [audioInputOutputDefinition],
	parameters: {
		frequency: frequencyParameter,
		resonance: {
			minValue: 0,
			maxValue: 100,
			defaultValue: 0,
			polarity: 'uni' as const
		}
	}
};

export const allowedSerializedAudioElementStaticDefinitions: {
	[key in NodeType]: {
		showCategory?: boolean;
		inputs: StaticInputOutputDefinition[];
		outputs: StaticInputOutputDefinition[];
		parameters: {
			[key: string]: {
				minValue: number;
				maxValue: number;
				unit?: string;
				defaultValue?: number;
				polarity: 'uni' | 'bi';
				binary?: boolean;
				linear?: boolean;
				highlightIndex?: number;
				discrete?: boolean;
			};
		};
	};
} = {
	sequencer: {
		inputs: [
			{
				...triggerInputOutputDefinition,
				contextDescription: 'Signal triggering next step in the sequencer.'
			}
		],
		outputs: [
			{
				...frequencyInputOutputDefinition,
				contextDescription: 'Frequency signal of the current\nstep in the sequencer.'
			}
		],
		parameters: {
			frequency1: { ...frequencyParameter, highlightIndex: 0 },
			frequency2: { ...frequencyParameter, highlightIndex: 1 },
			frequency3: { ...frequencyParameter, highlightIndex: 2 },
			frequency4: { ...frequencyParameter, highlightIndex: 3 },
			frequency5: { ...frequencyParameter, highlightIndex: 4 },
			frequency6: { ...frequencyParameter, highlightIndex: 5 },
			frequency7: { ...frequencyParameter, highlightIndex: 6 },
			frequency8: { ...frequencyParameter, highlightIndex: 7 }
		}
	},
	'pitch-quantizer': {
		inputs: [
			{
				...frequencyInputOutputDefinition,
				contextDescription: 'Frequency signal to be quantized.'
			}
		],
		outputs: [
			{
				...frequencyInputOutputDefinition,
				contextDescription: 'Frequency signal quantized to chosen scale.'
			}
		],
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
	'lowpass-filter': filterWithResonanceDefinition,
	'highpass-filter': filterWithResonanceDefinition,
	'bandpass-filter': filterWithResonanceDefinition,
	gain: {
		inputs: [audioInputOutputDefinition],
		outputs: [audioInputOutputDefinition],
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
		inputs: [numberInputOutputDefinition],
		outputs: [numberInputOutputDefinition],
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
		inputs: [
			{
				...numberInputOutputDefinition,
				minValue: -1,
				maxValue: 1,
				contextDescription: 'Bipolar signal to be converted.'
			}
		],
		outputs: [
			{
				...numberInputOutputDefinition,
				minValue: 0,
				maxValue: 1,
				contextDescription: 'Unipolar signal.'
			}
		],
		parameters: {}
	},
	pan: {
		inputs: [audioInputOutputDefinition],
		outputs: [audioInputOutputDefinition],
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
		inputs: [audioInputOutputDefinition, triggerInputOutputDefinition],
		outputs: [audioInputOutputDefinition],
		parameters: {
			delayTime: {
				minValue: 0,
				maxValue: 10,
				defaultValue: 0,
				polarity: 'uni'
			},
			feedback: {
				minValue: 0,
				maxValue: 1,
				defaultValue: 0,
				polarity: 'uni',
				linear: true
			},
			mix: {
				minValue: 0,
				maxValue: 1,
				defaultValue: 0.5,
				polarity: 'uni',
				linear: true
			}
		}
	},
	destination: {
		inputs: [audioInputOutputDefinition],
		outputs: [],
		parameters: {
			volume: {
				minValue: 0,
				maxValue: 1,
				defaultValue: 0,
				polarity: 'uni',
				linear: true
			}
		}
	},
	oscilloscope: {
		inputs: [
			{
				...numberInputOutputDefinition,
				minValue: -1,
				maxValue: 1,
				contextDescription: 'Signal to be visualized.'
			}
		],
		outputs: [
			{
				...numberInputOutputDefinition,
				minValue: -1,
				maxValue: 1,
				contextDescription: 'Pass-through.'
			}
		],
		parameters: {
			slow: buttonParameter
		}
	},
	value: {
		inputs: [numberInputOutputDefinition],
		outputs: [],
		parameters: {}
	},
	number: {
		inputs: [],
		outputs: [numberInputOutputDefinition],
		parameters: {
			value: {
				minValue: -10_000,
				maxValue: 10_000,
				polarity: 'bi',
				defaultValue: 0
			}
		}
	},
	convolution: {
		inputs: [audioInputOutputDefinition],
		outputs: [audioInputOutputDefinition],
		parameters: {
			mix: {
				minValue: 0,
				maxValue: 1,
				defaultValue: 0.5,
				polarity: 'uni',
				linear: true
			}
		}
	},
	clock: {
		inputs: [],
		outputs: [triggerInputOutputDefinition],
		parameters: {
			tempo: {
				defaultValue: 120,
				minValue: 0,
				maxValue: 1000,
				unit: 'BPM',
				polarity: 'uni'
			}
		}
	},
	'ad-envelope': {
		showCategory: true,
		inputs: [triggerInputOutputDefinition],
		outputs: [envelopeInputOutputDefinition],
		parameters: {
			attack: {
				minValue: 0,
				maxValue: 5 * 1000,
				unit: 'ms',
				defaultValue: 0,
				polarity: 'uni'
			},
			decay: {
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
		outputs: [frequencyInputOutputDefinition, gateInputOutputDefinition],
		parameters: {}
	},
	'gate-length': {
		inputs: [triggerInputOutputDefinition],
		outputs: [gateInputOutputDefinition],
		parameters: {
			length: {
				minValue: 0,
				maxValue: 60,
				unit: 's',
				defaultValue: 1,
				polarity: 'uni'
			}
		}
	},
	'measure-gate': {
		inputs: [triggerInputOutputDefinition],
		outputs: [secondsInputOutputDefinition],
		parameters: {}
	},
	'saw-lfo': lfoDefinition,
	'sine-lfo': lfoDefinition,
	'square-lfo': lfoDefinition,
	'triangle-lfo': lfoDefinition,
	pattern: {
		inputs: [triggerInputOutputDefinition],
		outputs: [triggerInputOutputDefinition],
		parameters: {
			step1: { ...buttonParameter, highlightIndex: 0 },
			step2: { ...buttonParameter, highlightIndex: 1 },
			step3: { ...buttonParameter, highlightIndex: 2 },
			step4: { ...buttonParameter, highlightIndex: 3 },
			step5: { ...buttonParameter, highlightIndex: 4 },
			step6: { ...buttonParameter, highlightIndex: 5 },
			step7: { ...buttonParameter, highlightIndex: 6 },
			step8: { ...buttonParameter, highlightIndex: 7 }
		}
	},
	tutorial: {
		inputs: [],
		outputs: [],
		parameters: {}
	},
	comment: {
		inputs: [],
		outputs: [],
		parameters: {}
	}
};

export const nodeTypes = Object.keys(allowedSerializedAudioElementStaticDefinitions).filter(
	(nodeType) => nodeType !== 'tutorial'
) as NodeType[];

export const readableNames: { [P in NodeType]: string } = {
	'sine-oscillator': 'Sine',
	'square-oscillator': 'Square',
	'saw-oscillator': 'Saw',
	'triangle-oscillator': 'Triangle',
	'ad-envelope': 'AD',
	'bipolar-to-unipolar': 'Bi → Uni',
	convolution: 'Convolution',
	delay: 'Delay',
	destination: 'Output',
	gain: 'Gain',
	'lowpass-filter': 'Lowpass',
	'bandpass-filter': 'Bandpass',
	'highpass-filter': 'Highpass',
	midi: 'MIDI',
	multiply: 'Mult',
	oscilloscope: 'Oscilloscope',
	pan: 'Pan',
	'pitch-quantizer': 'Pitch Quantizer',
	sequencer: 'Sequencer',
	clock: 'Clock',
	'gate-length': 'Gate Length',
	'measure-gate': 'Measure Gate',
	'saw-lfo': 'Saw',
	'sine-lfo': 'Sine',
	'square-lfo': 'Square',
	'triangle-lfo': 'Triangle',
	pattern: 'Pattern',
	tutorial: 'Tutorial',
	value: 'Value',
	number: 'Number',
	comment: 'Comment'
};

export const categorizedNodeTypes = {
	oscillator: [
		'sine-oscillator',
		'saw-oscillator',
		'square-oscillator',
		'triangle-oscillator'
	] as NodeType[],
	lfo: ['sine-lfo', 'saw-lfo', 'square-lfo', 'triangle-lfo'],
	envelope: ['ad-envelope'] as NodeType[],
	filter: ['lowpass-filter', 'bandpass-filter', 'highpass-filter'] as NodeType[],
	effects: ['convolution', 'delay'] as NodeType[],
	gain: ['gain', 'pan'] as NodeType[],
	pitch: ['sequencer', 'pitch-quantizer'] as NodeType[],
	math: ['number', 'multiply', 'bipolar-to-unipolar'] as NodeType[],
	clock: ['clock', 'gate-length', 'measure-gate', 'pattern'] as NodeType[],
	io: ['destination', 'midi'] as NodeType[],
	visualization: ['oscilloscope', 'value', 'comment'] as NodeType[],
	internal: ['tutorial'] as NodeType[]
};

const everyNodeIsIncludedInMenu = nodeTypes.every((nodeType) =>
	Object.values(categorizedNodeTypes).some((category) =>
		category.some((nodeTypeInCategory) => nodeTypeInCategory === nodeType)
	)
);

if (!everyNodeIsIncludedInMenu) {
	throw Error('Not every node is included in menu!');
}

export const readableCategoryNames: { [i: string]: string } = {
	oscillator: 'Oscillator',
	gain: 'Gain',
	filter: 'Filter',
	envelope: 'Envelope',
	effects: 'Effect',
	pitch: 'Pitch',
	math: 'Math',
	io: 'I/O',
	clock: 'Clock',
	visualization: 'Visualization',
	lfo: 'LFO',
	internal: 'Internal'
};

const allCategoriesHaveReadableNames = Object.keys(categorizedNodeTypes).every(
	(categoryName) => !!readableCategoryNames[categoryName]
);

if (!allCategoriesHaveReadableNames) {
	throw Error('Not all categories have readable names!');
}

export const defaultCategoryNodeColors: { [i: string]: string } = {
	oscillator: '#1E90FF',
	envelope: '#00FA9A',
	lfo: '#40E0D0',
	internal: '#45c7ff',
	math: '#9ab7bc',
	clock: '#e95e2a',
	visualization: '#6bbd6b',
	filter: '#9ACD32',
	effects: '#9370DB',
	pitch: '#DAA520',
	gain: '#d22d4e',
	io: '#d54ca3'
};

const allCategoriesHaveDefaultColors = Object.keys(categorizedNodeTypes).every(
	(categoryName) => !!defaultCategoryNodeColors[categoryName]
);

if (!allCategoriesHaveDefaultColors) {
	throw Error('Not all categories have default colors!');
}

export const getDefaultColorForNode = (nodeType: string) => {
	const category = Object.entries(categorizedNodeTypes)
		.filter(([_, nodeTypes]) => nodeTypes.some(equals(nodeType)))
		.map(([category]) => category)[0];

	if (category) {
		return defaultCategoryNodeColors[category];
	} else {
		return '#000000';
	}
};

export const getCategoryReadableName = (nodeType: string) => {
	const category = Object.entries(categorizedNodeTypes)
		.filter(([_, nodeTypes]) => nodeTypes.some(equals(nodeType)))
		.map(([category]) => category)[0];

	if (category) {
		return readableCategoryNames[category];
	} else {
		return null;
	}
};
