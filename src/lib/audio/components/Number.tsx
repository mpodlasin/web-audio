import React from 'react';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

export interface NumberState {
    number: number;
}

export const NumberDefinition: AudioComponentDefinition<void, NumberState> = {
    component: Number,
    initializeMutableState: () => undefined,
    initialSerializableState: {
        number: 0
    },
    inPlugs: [],
    outPlugs: [
      {
        type: 'number',
        name: 'Number',
        getParameter: (_, state) => state.number,
      },
    ],
    color: 'lightcoral',
};

export type NumberProps = AudioComponentProps<void, NumberState>;

export function Number({ serializableState: state, onSerializableStateChange: onStateChange }: NumberProps) {
    const [number, setNumber] = React.useState(`${state.number}`);

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        const valueAsNumber = e.currentTarget.valueAsNumber;

        setNumber(value);
        
        if (!isNaN(valueAsNumber)) {
            onStateChange(state => ({...state, number: valueAsNumber}));
        }
    }

    return (
        <div>
            <input value={number} onChange={handleChange} type="number" />
        </div>
    )
};