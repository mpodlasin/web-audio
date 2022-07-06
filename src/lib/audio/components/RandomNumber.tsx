import React from 'react';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

export interface RandomNumberState {
    randomNumber: number;
}

export const RandomNumberDefinition: AudioComponentDefinition<void, RandomNumberState> = {
    component: RandomNumber,
    initializeMutableState: () => undefined,
    initialSerializableState: {
        randomNumber: 0
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
        name: 'Random Number',
        getParameter: (_, state) => state.randomNumber,
      },
    ],
    color: 'lightcoral',
};

export type RandomNumberProps = AudioComponentProps<void, RandomNumberState>;

export function RandomNumber({ serializableState: state, onSerializableStateChange: onStateChange, inPlugs }: RandomNumberProps) {
    React.useEffect(() => {
        const ping = inPlugs.ping['Ping'].value;

        if (ping) {
            const subscription = ping.subscribe(() => {
                onStateChange(state => ({...state, randomNumber: Math.random()}))
            });

            return () => subscription.unsubscribe();
        }
    }, [inPlugs.ping['Ping'].value]);

    return (
        <div>
            <input readOnly type="number" value={state.randomNumber} />
        </div>
    )
};