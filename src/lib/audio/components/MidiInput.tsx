import React from 'react';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

export const MidiInputDefinition: AudioComponentDefinition<void, void> = {
    component: MidiInput,
    initializeMutableState: () => undefined,
    initialSerializableState: undefined,
    inPlugs: {},
    outPlugs: {
        'Frequency': {
            type: 'number',
        }
    },
    color: 'lightgreen',
  }

export type MidiInputProps = AudioComponentProps<void, void>;

export function MidiInput({ outPlugs, applicationContext }: MidiInputProps) {
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

        const frequency = outPlugs.number['Frequency'].value;

        if (!frequency) return;

        const midiMessageHandler = (e: WebMidi.MIDIMessageEvent) => {
            const frequencyValue = 440 * Math.pow(2, (e.data[1] - 69) / 12);

            frequency.setValueAtTime(frequencyValue, applicationContext.globalAudioContext.currentTime);
            
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