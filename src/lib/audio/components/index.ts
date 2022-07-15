import { AudioComponentDefinition } from "./AudioComponentDefinition";
import { EnvelopeDefinition } from "./Envelope";
import { FilterDefinition } from "./Filter";
import { GainDefinition } from "./Gain";
import { MidiInputDefinition } from "./MidiInput";
import { NumberDefinition } from "./Number";
import { OscillatorDefinition } from "./Oscillator";
import { OutputDefinition } from "./Output";
import { ButtonDefinition } from "./Button";
import { SequencerDefinition } from "./Sequencer";
import { ReverbDefinition } from "./Reverb";
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
    'Button': ButtonDefinition,
    'Envelope': EnvelopeDefinition,
    'Reverb': ReverbDefinition,
};