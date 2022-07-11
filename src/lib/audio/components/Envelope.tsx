import React from 'react';
import { EnvelopedAudioParamPing } from '../nodes/EnvelopedAudioParamPing';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

export interface EnvelopeState {
    attack: number;
    delay: number;
    sustain: number;
    release: number;
}

export const EnvelopeDefinition: AudioComponentDefinition<EnvelopedAudioParamPing, EnvelopeState> = {
    component: Envelope,
    initializeMutableState: () => new EnvelopedAudioParamPing({ attack: 0, release: 0 }),
    initialSerializableState: {
        attack: 0,
        delay: 0,
        sustain: 0,
        release: 0,
    },
    inPlugs: [
        {
            type: 'ping',
            name: 'Ping',
            getParameter: envelopedAudioParam => envelopedAudioParam,
        }
    ],
    outPlugs: [
      {
        type: 'number',
        name: 'Gain',
      },
    ],
    color: 'lightcoral',
};

export type EnvelopeProps = AudioComponentProps<EnvelopedAudioParamPing, EnvelopeState>;

export function Envelope({ mutableState: envelopedNode, serializableState: state, onSerializableStateChange: onStateChange, inPlugs, outPlugs }: EnvelopeProps) {
    React.useEffect(() => {
        const gain = outPlugs.number['Gain'].value;

        if (gain) {
            envelopedNode.baseAudioParameter = gain;
        }
    }, [outPlugs.number['Gain'].value, envelopedNode]);

    React.useEffect(() => {
        envelopedNode.options.attack = state.attack;
        envelopedNode.options.release = state.release;
    }, [envelopedNode, state.attack, state.release]);

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
                <input type="range" value={state.attack} onChange={changeAttack} min={0} max={10_000} />
            </div>
            <div>
                <label>Delay</label>
                <input type="range" value={state.delay} onChange={changeDelay} min={0} max={10_000} />
            </div>
            <div>
                <label>Sustain</label>
                <input type="range" value={state.sustain} onChange={changeSustain} min={0} max={100} />
            </div>
            <div>
                <label>Release</label>
                <input type="range" value={state.release} onChange={changeRelease} min={0} max={10_000} />
            </div>
            <div>A: {state.attack}ms, R: {state.release}ms</div>
        </div>
    )
};