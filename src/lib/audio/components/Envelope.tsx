import React from 'react';
import { AggregatedPing } from '../nodes/AggregatedPing';
import { EnvelopedAudioParamPing } from '../nodes/EnvelopedAudioParamPing';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

export interface EnvelopeState {
    attack: number;
    delay: number;
    sustain: number;
    release: number;
}

export const EnvelopeDefinition: AudioComponentDefinition<AggregatedPing, EnvelopeState> = {
    component: Envelope,
    initializeMutableState: () => new AggregatedPing([
        new EnvelopedAudioParamPing({ attack: 0, release: 0, maxValue: 1, minValue: 0 }),
        new EnvelopedAudioParamPing({ attack: 0, release: 0, maxValue: 2000, minValue: 0 }),
    ]),
    initialSerializableState: {
        attack: 0,
        delay: 0,
        sustain: 0,
        release: 0,
    },
    inPlugs: {
        'Ping': {
            type: 'ping',
            getParameter: envelopedAudioParam => envelopedAudioParam,
        }
    },
    outPlugs: {
        'Gain': {
            type: 'number',
        },
        'Frequency': {
            type: 'number'
        }
    },
    color: 'lightcoral',
};

export type EnvelopeProps = AudioComponentProps<AggregatedPing, EnvelopeState>;

export function Envelope({ mutableState: ping, serializableState: state, onSerializableStateChange: onStateChange, outPlugs }: EnvelopeProps) {
    const envelopedGainNode = ping.pings[0] as EnvelopedAudioParamPing;
    const envelopedFrequencyNode = ping.pings[1] as EnvelopedAudioParamPing;
    
    React.useEffect(() => {
        const gain = outPlugs.number['Gain'].value;

        if (gain) {
            envelopedGainNode.baseAudioParameter = gain;
        }
    }, [outPlugs.number['Gain'].value, envelopedGainNode]);

    React.useEffect(() => {
        envelopedGainNode.options.attack = state.attack;
        envelopedGainNode.options.release = state.release;
    }, [envelopedGainNode, state.attack, state.release]);

    React.useEffect(() => {
        const frequency = outPlugs.number['Frequency'].value;

        if (frequency) {
            envelopedFrequencyNode.baseAudioParameter = frequency;
        }
    }, [outPlugs.number['Frequency'].value, envelopedFrequencyNode]);

    React.useEffect(() => {
        envelopedFrequencyNode.options.attack = state.attack;
        envelopedFrequencyNode.options.release = state.release;
    }, [envelopedGainNode, state.attack, state.release]);

    const changeAttack = (e: React.FormEvent<HTMLInputElement>) => {
        const currentTarget = e.currentTarget;
        onStateChange(state => ({...state, attack: currentTarget.valueAsNumber}));
    };

    const changeDelay = (e: React.FormEvent<HTMLInputElement>) => {
        const currentTarget = e.currentTarget;
        onStateChange(state => ({...state, delay: currentTarget.valueAsNumber}));
    };

    const changeSustain = (e: React.FormEvent<HTMLInputElement>) => {
        const currentTarget = e.currentTarget;
        onStateChange(state => ({...state, sustain: currentTarget.valueAsNumber}));
    };

    const changeRelease = (e: React.FormEvent<HTMLInputElement>) => {
        const currentTarget = e.currentTarget;
        onStateChange(state => ({...state, release: currentTarget.valueAsNumber}));
    };

    return (
        <div>
            <div>
                <label>Attack</label>
                <input type="range" value={state.attack} onChange={changeAttack} min={0} max={1_000} />
            </div>
            <div>
                <label>Delay</label>
                <input type="range" value={state.delay} onChange={changeDelay} min={0} max={1_000} />
            </div>
            <div>
                <label>Sustain</label>
                <input type="range" value={state.sustain} onChange={changeSustain} min={0} max={100} />
            </div>
            <div>
                <label>Release</label>
                <input type="range" value={state.release} onChange={changeRelease} min={0} max={1_000} />
            </div>
            <div>A: {state.attack}ms, R: {state.release}ms</div>
        </div>
    )
};