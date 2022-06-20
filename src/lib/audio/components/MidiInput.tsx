import React from 'react';
import { Subject } from 'rxjs';

export const MidiInput = ({ audioElement }: { audioElement: Subject<number>}) => {
    const [inputs, setInputs] = React.useState<WebMidi.MIDIInput[]>([]);
    const [chosenInputIndex] = React.useState(0);

    const [lastMidiEvent, setLastMidiEvent] = React.useState<any>();

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
            audioElement.next( 440 * Math.pow(2, (e.data[1] - 69) / 12));
            setLastMidiEvent(e.data);
        };

        chosenInput.addEventListener('midimessage', midiMessageHandler);

        return () => {
            chosenInput.removeEventListener('midimessage', midiMessageHandler as (e: Event) => void);
        }
    }, [audioElement, chosenInput]);

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