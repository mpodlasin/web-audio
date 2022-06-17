import React from 'react';

export const MidiInput = () => {
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