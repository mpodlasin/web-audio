import type { SerializedAudioElements } from '../audio/AudioCanvas';

export const oscillatorGainDestination: SerializedAudioElements = {
	'1': {
		type: 'oscillator',
		oscillatorType: 'sine',
		parameters: {
			frequency: 440,
			detune: 0
		}
	},
	'2': {
		type: 'gain',
		inputs: ['1'],
		parameters: {
			gain: 0.5
		}
	},
	'3': {
		type: 'destination',
		inputs: ['2']
	}
};
