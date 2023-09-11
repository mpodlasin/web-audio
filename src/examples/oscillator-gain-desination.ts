import type { SerializedAudioElements } from '../audio/AudioCanvas';

export const oscillatorGainDestination: SerializedAudioElements = {
	'1': {
		type: 'oscillator',
		oscillatorType: 'sine',
		parameters: {
			frequency: { base: 440, inputs: [] },
			detune: { base: 0, inputs: [] }
		}
	},
	'2': {
		type: 'gain',
		inputs: ['1'],
		parameters: {
			gain: { base: 0.5, inputs: [] }
		}
	},
	'3': {
		type: 'destination',
		inputs: ['2']
	}
};
