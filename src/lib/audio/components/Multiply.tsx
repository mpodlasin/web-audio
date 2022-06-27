import React from 'react';
import { combineLatest, map, Observable, Subject } from 'rxjs';
import { AudioPlug } from '../AudioPlug';
import { AudioComponentDefinition } from './AudioComponentDefinition';

export const MultiplyDefinition: AudioComponentDefinition<Subject<number>, void> = {
    component: Multiply,
    getAudioElement: () => new Subject(),
    initialState: undefined,
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
        getAudioParameter: audioElement => audioElement,
      },
    ]
};

export interface MultiplyProps {
    audioElement: Subject<number>,
    inPlugs: {
        [name: string]: AudioPlug;
    }
}

export function Multiply({ audioElement, inPlugs }: MultiplyProps) {
    const [result, setResult] = React.useState<number | null>(null);
    React.useEffect(() => {
        const numberA = inPlugs['Number A'];
        const numberB = inPlugs['Number B'];

        if (numberA === undefined || !(numberA.audioParameter instanceof Observable)) return;
        if (numberB === undefined || !(numberB.audioParameter instanceof Observable)) return;

        const subscription = combineLatest([numberA.audioParameter, numberB.audioParameter]).pipe(
            map(([a, b]) => a * b)
        ).subscribe(audioElement);

        return () => subscription.unsubscribe();
    }, [audioElement]);

    React.useEffect(() => {
        const subscription = audioElement.subscribe(setResult);

        return () => subscription.unsubscribe();
    }, [audioElement]);

    return (
        <div>{result}</div>
    );
};