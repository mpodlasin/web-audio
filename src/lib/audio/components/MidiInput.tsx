import React from 'react';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

interface MidiInputState {
    frequency: number;
}

export const MidiInputDefinition: AudioComponentDefinition<void, MidiInputState> = {
    component: MidiInput,
    initializeMutableState: () => undefined,
    initialSerializableState: {
        frequency: 0,
    },
    inPlugs: [],
    outPlugs: [
      {
        type: 'number',
        name: 'Frequency',
        getParameter: (_, state) => state.frequency,
      }
    ],
    color: 'lightgreen',
  }

export type MidiInputProps = AudioComponentProps<void, MidiInputState>;

export function MidiInput({ serializableState: state, onSerializableStateChange: onStateChange }: MidiInputProps) {
    const [inputs, setInputs] = React.useState<WebMidi.MIDIInput[]>([]);
    const [chosenInputIndex] = React.useState(0);

    const [lastMidiEvent, setLastMidiEvent] = React.useState<Uint8Array>();

    const chosenInput = inputs[chosenInputIndex];

    React.useEffect(() => {
        navigator.requestMIDIAccess().then(access => {
            const inputs = access.inputs;
            setInputs([...inputs.values()]);
        });
    }, []);

    React.useEffect(() => {
        if (!chosenInput) return;

        const midiMessageHandler = (e: WebMidi.MIDIMessageEvent) => {
            onStateChange(state => ({...state, frequency: 440 * Math.pow(2, (e.data[1] - 69) / 12)}));
            setLastMidiEvent(e.data);
        };

        chosenInput.addEventListener('midimessage', midiMessageHandler);

        return () => {
            chosenInput.removeEventListener('midimessage', midiMessageHandler as (e: Event) => void);
        }
    }, [chosenInput]);

    return (
        <div>
            <select>
                {inputs.map(input => <option key={input.name}>{input.name}</option>)}
            </select>
            <div>
                {JSON.stringify(lastMidiEvent && Array.from(lastMidiEvent))}
            </div>
        </div>
    );
}