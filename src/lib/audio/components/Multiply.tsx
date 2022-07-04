import React from 'react';
import { AudioPlug } from '../AudioPlug';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

export interface MultiplyState {
    result: number;
}

export const MultiplyDefinition: AudioComponentDefinition<void, MultiplyState> = {
    component: Multiply,
    initializeMutableState: () => undefined,
    initialSerializableState: {
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
        getParameter: (_, state) => state.result,
      },
    ],
    color: 'lightgreen',
};

export type MultiplyProps = AudioComponentProps<void, MultiplyState>;

export function Multiply({ serializableState: state, onSerializableStateChange: onStateChange, inPlugs }: MultiplyProps) {

    React.useEffect(() => {
        const valueA = inPlugs.number['Number A'];
        const valueB = inPlugs.number['Number B'];
        
        if (valueA && valueB) {
            onStateChange(state = ({...state, result: valueA * valueB}));
        }
    }, [inPlugs.number['Number A'], inPlugs.number['Number B']]);

    return (
        <div>{state.result.toFixed(2)}</div>
    );
};