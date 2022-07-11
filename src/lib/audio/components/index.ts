import { AudioComponentDefinition } from "./AudioComponentDefinition";
import { EnvelopeDefinition } from "./Envelope";
import { FilterDefinition } from "./Filter";
import { GainDefinition } from "./Gain";
import { MidiInputDefinition } from "./MidiInput";
import { NumberDefinition } from "./Number";
import { OscillatorDefinition } from "./Oscillator";
import { OutputDefinition } from "./Output";
import { PingDefinition } from "./Ping";
import { SequencerDefinition } from "./Sequencer";
export interface ComponentDefinitions {
    [index: string]: AudioComponentDefinition<any, any>;
  }

export const COMPONENTS: ComponentDefinitions = {
    'Oscillator': OscillatorDefinition,
    'Gain': GainDefinition,
    'Output': OutputDefinition,
    'MIDI Input': MidiInputDefinition,
    'Number': NumberDefinition,
    'Filter': FilterDefinition,
    'Sequencer': SequencerDefinition,
    'Ping': PingDefinition,
    'Envelope': EnvelopeDefinition,
};