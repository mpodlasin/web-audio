import React from 'react';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

export interface EnvelopeState {
    gain: number;
    attack: number;
    delay: number;
    sustain: number;
    release: number;
}

export const EnvelopeDefinition: AudioComponentDefinition<void, EnvelopeState> = {
    component: Envelope,
    initializeMutableState: () => undefined,
    initialSerializableState: {
        gain: 0,
        attack: 0,
        delay: 0,
        sustain: 0,
        release: 0,
    },
    inPlugs: [
        {
            type: 'ping',
            name: 'Ping',
        }
    ],
    outPlugs: [
      {
        type: 'number',
        name: 'Gain',
        getParameter: (_, state) => state.gain,
      },
    ],
    color: 'lightcoral',
};

export type EnvelopeProps = AudioComponentProps<void, EnvelopeState>;

export function Envelope({ serializableState: state, onSerializableStateChange: onStateChange, inPlugs }: EnvelopeProps) {
    React.useEffect(() => {
        const ping = inPlugs.ping['Ping'];

        if (ping) {
            const subscription = ping.subscribe(() => {
                let counter = 0;
                const id = setInterval(() => {
                    counter += 10;

                    onStateChange(state => ({...state, gain: Math.random()}))

                    if (counter > state.attack + state.release) {
                        clearInterval(id);
                    }
                }, 10);
            });

            return () => subscription.unsubscribe();
        }
    }, [inPlugs.ping['Ping']]);

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
            <div>{state.gain}</div>
        </div>
    )
};