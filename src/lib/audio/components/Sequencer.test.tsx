import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { OutAudioPlugValues } from './AudioComponentDefinition';
import { SequencerDefinition, SequencerProps } from './Sequencer';

const Sequencer = SequencerDefinition.component;

const SequencerWithState = (props: Omit<SequencerProps, 'serializableState' | 'onSerializableStateChange'>) => {
    const [serializableState, onSerializableStateChange] = React.useState(SequencerDefinition.initialSerializableState);
    return (<Sequencer {...props} serializableState={serializableState} onSerializableStateChange={onSerializableStateChange} />);
};

jest.useFakeTimers();

const globalAudioContext = { currentTime: 0 } as AudioContext;

describe('Sequencer', () => {
    it('renders', () => {
        const outPlugs: OutAudioPlugValues = {
            ping: {
                Ping: {connected: false, value: undefined},
            },
            number: {
                Frequency: {connected: false, value: undefined},
            }
        }

        render(<SequencerWithState 
            mutableState={SequencerDefinition.initializeMutableState({ globalAudioContext })} 
            outPlugs={outPlugs}
            applicationContext={{ globalAudioContext }}
        />);
    });

    it('schedules first note on frequency plug audio param, once started', () => {
        const frequencyStub = {
            setValueAtTime: jest.fn(),
        };

        const outPlugs: OutAudioPlugValues = {
            ping: {
                Ping: {connected: false, value: undefined},
            },
            number: {
                Frequency: {connected: false, value: frequencyStub as any as AudioParam},
            },
        };

        render(<SequencerWithState 
            mutableState={SequencerDefinition.initializeMutableState({ globalAudioContext })}
            outPlugs={outPlugs}
            applicationContext={{ globalAudioContext }}
        />);

        screen.getByLabelText('Step 0, note 0').click();

        const playButton = screen.getByText('Play');
        playButton.click();

        jest.advanceTimersByTime(25);

        expect(frequencyStub.setValueAtTime).toHaveBeenCalledTimes(1);
        expect(frequencyStub.setValueAtTime.mock.calls[0]).toEqual([77.78174593052022, 0]);
    });

    it('schedules first note based on time sent by incoming ping', () => {
        const frequencyStub = {
            setValueAtTime: jest.fn(),
        };

        const outPlugs: OutAudioPlugValues = {
            ping: {
                Ping: {connected: false, value: undefined},
            },
            number: {
                Frequency: {connected: false, value: frequencyStub as any as AudioParam},
            },
        };

        const callbackPing = SequencerDefinition.initializeMutableState({ globalAudioContext });

        render(<SequencerWithState 
            mutableState={callbackPing}
            outPlugs={outPlugs}
            applicationContext={{ globalAudioContext }}
        />);

        screen.getByLabelText('Step 0, note 0').click();

        act(() => {
            callbackPing.start(0.001);
        });

        jest.advanceTimersByTime(25);

        expect(frequencyStub.setValueAtTime).toHaveBeenCalledTimes(1);
        expect(frequencyStub.setValueAtTime.mock.calls[0]).toEqual([77.78174593052022, 0.001]);
    });
});