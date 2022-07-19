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
            mutableState={SequencerDefinition.initializeMutableState({ globalAudioContext, lookahead: 100 })} 
            outPlugs={outPlugs}
            applicationContext={{ globalAudioContext, lookahead: 100 }}
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
            mutableState={SequencerDefinition.initializeMutableState({ globalAudioContext, lookahead: 100 })}
            outPlugs={outPlugs}
            applicationContext={{ globalAudioContext, lookahead: 100 }}
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

        const callbackPing = SequencerDefinition.initializeMutableState({ globalAudioContext, lookahead: 100 });

        render(<SequencerWithState 
            mutableState={callbackPing}
            outPlugs={outPlugs}
            applicationContext={{ globalAudioContext, lookahead: 100 }}
        />);

        screen.getByLabelText('Step 0, note 0').click();

        act(() => {
            callbackPing.start(0.001);
        });

        jest.advanceTimersByTime(25);

        expect(frequencyStub.setValueAtTime).toHaveBeenCalledTimes(1);
        expect(frequencyStub.setValueAtTime.mock.calls[0]).toEqual([77.78174593052022, 0.001]);
    });

    it('schedules multiple notes with larger lookahead', () => {
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
            mutableState={SequencerDefinition.initializeMutableState({ globalAudioContext, lookahead: 100 })}
            outPlugs={outPlugs}
            applicationContext={{ globalAudioContext, lookahead: 1000 }}
        />);

        /* Those notes should be played */
        screen.getByLabelText('Step 0, note 0').click();
        screen.getByLabelText('Step 1, note 1').click();
        screen.getByLabelText('Step 2, note 2').click();
        screen.getByLabelText('Step 3, note 3').click();
        /* Those should not (lookahead to small) */
        screen.getByLabelText('Step 4, note 4').click();
        screen.getByLabelText('Step 5, note 5').click();
        screen.getByLabelText('Step 6, note 6').click();
        screen.getByLabelText('Step 7, note 7').click();

        const playButton = screen.getByText('Play');
        playButton.click();

        jest.advanceTimersByTime(25);

        expect(frequencyStub.setValueAtTime).toHaveBeenCalledTimes(4);
        expect(frequencyStub.setValueAtTime.mock.calls[0]).toEqual([77.78174593052022, 0]);
        expect(frequencyStub.setValueAtTime.mock.calls[1]).toEqual([87.30705785825097, 0.25]);
        expect(frequencyStub.setValueAtTime.mock.calls[2]).toEqual([92.49860567790861, 0.5]);
        expect(frequencyStub.setValueAtTime.mock.calls[3]).toEqual([103.82617439498628, 0.75]);
    });
});