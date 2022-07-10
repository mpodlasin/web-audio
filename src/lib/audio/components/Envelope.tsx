import React from 'react';
import { GLOBAL_AUDIO_CONTEXT } from '../audioContext';
import { EnvelopedAudioParam } from '../nodes/EnvelopedAudioParam';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

export interface EnvelopeState {
    attack: number;
    delay: number;
    sustain: number;
    release: number;
}

export const EnvelopeDefinition: AudioComponentDefinition<EnvelopedAudioParam, EnvelopeState> = {
    component: Envelope,
    initializeMutableState: () => new EnvelopedAudioParam({ attack: 300 }),
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
            getParameter: envelopedAudioParam => envelopedAudioParam as any as AudioParam,
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

export type EnvelopeProps = AudioComponentProps<EnvelopedAudioParam, EnvelopeState>;

export function Envelope({ mutableState: envelopedNode, serializableState: state, onSerializableStateChange: onStateChange, inPlugs, outPlugs }: EnvelopeProps) {
    React.useEffect(() => {
        const gain = outPlugs.number['Gain'].value;

        if (gain) {
            envelopedNode.baseAudioParameter = gain;
        }
    }, [outPlugs.number['Gain'].value, envelopedNode]);

    React.useEffect(() => {
        const ping = inPlugs.ping['Ping'].value;
        const gain = outPlugs.number['Gain'].value;

        if (ping && gain) {
            const subscription = ping.subscribe(() => {
                const currentTime = GLOBAL_AUDIO_CONTEXT.currentTime;

                gain.setValueAtTime(0, currentTime);
                gain.linearRampToValueAtTime(0.05, currentTime + (state.attack / 1000));
                gain.linearRampToValueAtTime(0, currentTime + (state.attack / 1000) + (state.release / 1000));
            });

            return () => subscription.unsubscribe();
        }
    }, [inPlugs.ping['Ping'].value, outPlugs.number['Gain'].value]);

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
        </div>
    )
};