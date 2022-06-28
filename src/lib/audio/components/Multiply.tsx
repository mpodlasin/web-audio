import React from 'react';
import { AudioPlug } from '../AudioPlug';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

export interface MultiplyState {
    result: number;
}

export const MultiplyDefinition: AudioComponentDefinition<void, MultiplyState> = {
    component: Multiply,
    initialState: {
        result: 0,
    },
    inPlugs: [
        {
            type: 'number',
            name: 'Number A',
          },
          {
            type: 'number',
            name: 'Number B',
          },
    ],
    outPlugs: [
      {
        type: 'number',
        name: 'Number',
        getStateParameter: state => state.result,
      },
    ]
};

export type MultiplyProps = AudioComponentProps<void, MultiplyState>;

export function Multiply({ state, onStateChange, inPlugs }: MultiplyProps) {

    React.useEffect(() => {
        const valueA = inPlugs['Number A'].value;
        const valueB = inPlugs['Number B'].value;

        if (valueA && valueB) {
            onStateChange(state = ({...state, result: valueA * valueB}));
        }
    }, [inPlugs['Number A'].value, inPlugs['Number B'].value]);

    return (
        <div>{state.result}</div>
    );
};