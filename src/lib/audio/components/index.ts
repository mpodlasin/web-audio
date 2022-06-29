import { AudioComponentDefinition } from "./AudioComponentDefinition";
import { FilterDefinition } from "./Filter";
import { GainDefinition } from "./Gain";
import { MidiInputDefinition } from "./MidiInput";
import { MultiplyDefinition } from "./Multiply";
import { NumberDefinition } from "./Number";
import { OscillatorDefinition } from "./Oscillator";
import { OutputDefinition } from "./Output";
export interface ComponentDefinitions {
    [index: string]: AudioComponentDefinition<any, any>;
  }

export const COMPONENTS: ComponentDefinitions = {
    'Oscillator': OscillatorDefinition,
    'Gain': GainDefinition,
    'Output': OutputDefinition,
    'MIDI Input': MidiInputDefinition,
    'Number': NumberDefinition,
    'Multiply': MultiplyDefinition,
    'Filter': FilterDefinition,
};