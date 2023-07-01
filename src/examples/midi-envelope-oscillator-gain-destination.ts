import type { SerializedAudioElements } from "../audio/AudioCanvas";

export const midiEnvelopeOscillatorGainDestination: SerializedAudioElements = {
    '1': {
        type: 'midi' as const,
        parameters: {},
    },
    '2': {
        type: 'envelope' as const,
        inputs: [{ id: '1', output: 'trigger'}],
        parameters: {},
        attack: 0,
        decay: 0,
        sustain: 0.5,
        release: 0.9,
    },
    '3': {
        type: 'oscillator' as const,
        parameters: {
            frequency: [{ id: '1', output: 'frequency'}], 
            detune: 0,
        },
        oscillatorType: 'sawtooth' as const
    },	
    '4': {
        type: 'gain' as const,
        inputs: ['3'],
        parameters: {
            gain: ['2'],
        },
    },
    '5': {
        type: 'destination' as const,
        inputs: ['4'],
    }
};