import { equals } from '../../utils/equals';
import type { NodeType } from './types';

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
	outputs: ['audio'],
	parameters: {
		frequency: {
			minValue: 0,
			maxValue: 10,
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
		negate: buttonParameter
	}
};

const oscillatorDefinition = {
	showCategory: true,
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

const filterWithResonanceDefinition = {
	showCategory: true,
	inputs: ['audio'],
	outputs: ['audio'],
	parameters: {
		frequency: frequencyParameter,
		resonance: {
			minValue: 0,
			maxValue: 770,
			defaultValue: 0,
			polarity: 'uni' as const
		}
	}
};

export const allowedSerializedAudioElementStaticDefinitions: {
	[key in NodeType]: {
		showCategory?: boolean;
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
				highlightIndex?: number;
			};
		};
	};
} = {
	sequencer: {
		inputs: ['trigger'],
		outputs: ['frequency'],
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
	'lowpass-filter': filterWithResonanceDefinition,
	'highpass-filter': filterWithResonanceDefinition,
	'bandpass-filter': filterWithResonanceDefinition,
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
		inputs: ['audio', 'trigger'],
		outputs: ['audio'],
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
	trigger: {
		inputs: [],
		outputs: ['trigger'],
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
	'ar-envelope': {
		showCategory: true,
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
	'ad-envelope': {
		showCategory: true,
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
		outputs: ['frequency', 'trigger'],
		parameters: {}
	},
	'gate-length': {
		inputs: ['trigger'],
		outputs: ['trigger'],
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
		inputs: ['trigger'],
		outputs: ['value'],
		parameters: {}
	},
	'saw-lfo': lfoDefinition,
	'sine-lfo': lfoDefinition,
	'square-lfo': lfoDefinition,
	'triangle-lfo': lfoDefinition,
	pattern: {
		inputs: ['trigger'],
		outputs: ['trigger'],
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
	}
};

export const nodeTypes = Object.keys(allowedSerializedAudioElementStaticDefinitions) as NodeType[];

export const readableNames: { [P in NodeType]: string } = {
	'sine-oscillator': 'Sine',
	'square-oscillator': 'Square',
	'saw-oscillator': 'Saw',
	'triangle-oscillator': 'Triangle',
	'ar-envelope': 'AR',
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
	trigger: 'Trigger',
	'gate-length': 'Gate Length',
	'measure-gate': 'Measure Gate',
	'saw-lfo': 'Saw',
	'sine-lfo': 'Sine',
	'square-lfo': 'Square',
	'triangle-lfo': 'Triangle',
	pattern: 'Pattern'
};

export const categorizedNodeTypes = {
	oscillator: [
		'sine-oscillator',
		'saw-oscillator',
		'square-oscillator',
		'triangle-oscillator'
	] as NodeType[],
	lfo: ['sine-lfo', 'saw-lfo', 'square-lfo', 'triangle-lfo'],
	envelope: ['ar-envelope', 'ad-envelope'] as NodeType[],
	filter: ['lowpass-filter', 'bandpass-filter', 'highpass-filter'] as NodeType[],
	effects: ['convolution', 'delay'] as NodeType[],
	gain: ['gain', 'pan'] as NodeType[],
	pitch: ['sequencer', 'pitch-quantizer'] as NodeType[],
	math: ['multiply', 'bipolar-to-unipolar'] as NodeType[],
	io: ['destination', 'midi'] as NodeType[],
	clock: ['trigger', 'gate-length', 'measure-gate', 'pattern'] as NodeType[],
	visualization: ['oscilloscope'] as NodeType[]
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
	lfo: 'LFO'
};

const allCategoriesHaveReadableNames = Object.keys(categorizedNodeTypes).every(
	(categoryName) => !!readableCategoryNames[categoryName]
);

if (!allCategoriesHaveReadableNames) {
	throw Error('Not all categories have readable names!');
}

export const defaultCategoryNodeColors: { [i: string]: string } = {
	oscillator: '#45c7ff',
	filter: '#4754ff',
	gain: '#ff4747',
	envelope: '#47ff8e',
	effects: '#4754ff',
	pitch: '#ffe747',
	math: '#b7c3e6',
	io: '#b7c3e6',
	clock: '#fd783f',
	visualization: '#b7c3e6',
	lfo: '#45c7ff'
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
