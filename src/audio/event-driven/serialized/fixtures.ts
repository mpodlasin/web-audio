import type { SerializedGainNode, SerializedSineOscillatorNode } from '../../serialized';

export const defaultSineOscillatorNode: SerializedSineOscillatorNode = {
	type: 'sine-oscillator',
	inputs: [],
	parameters: {
		frequency: {
			base: 440,
			inputs: []
		},
		detune: {
			base: 0,
			inputs: []
		}
	},
	ui: {
		position: {
			x: 1,
			y: 2
		},
		primmaryColor: '#45c7ff'
	}
};

export const defaultGainNode: SerializedGainNode = {
	type: 'gain',
	inputs: [],
	parameters: {
		gain: {
			base: 1,
			inputs: []
		}
	},
	ui: {
		position: {
			x: 3,
			y: 4
		},
		primmaryColor: '#45c7ff'
	}
};
