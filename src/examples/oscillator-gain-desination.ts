import type { SerializedAudioElements } from "../audio/AudioCanvas";

export const oscillatorGainDestination: SerializedAudioElements = {
    '1': {
        type: 'oscillator',
        parameters: {
            frequency: 440
        },
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
    },
}