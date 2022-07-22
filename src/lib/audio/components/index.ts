import { AudioComponentDefinition } from "./AudioComponentDefinition";
import { EnvelopeDefinition } from "./Envelope";
import { FilterDefinition } from "./Filter";
import { GainDefinition } from "./Gain";
import { MidiInputDefinition } from "./MidiInput";
import { OscillatorDefinition } from "./Oscillator";
import { OutputDefinition } from "./Output";
import { ButtonDefinition } from "./Button";
import { SequencerDefinition } from "./Sequencer";
import { ReverbDefinition } from "./Reverb";
import { GraphDefinition } from "./Graph";
import React from "react";
import { memoComparer } from "../../react/memoComparer";
export interface ComponentDefinitions {
    [index: string]: AudioComponentDefinition<any, any>;
  }

export const memoizeComponentInDefinition = <MutableState, SerializableState>(
  definition: AudioComponentDefinition<MutableState, SerializableState>
  ): AudioComponentDefinition<MutableState, SerializableState> => ({
    ...definition,
    component: React.memo(definition.component, memoComparer)
  });

export const COMPONENTS: ComponentDefinitions = {
    'Oscillator': memoizeComponentInDefinition(OscillatorDefinition),
    'Gain': memoizeComponentInDefinition(GainDefinition),
    'Output': memoizeComponentInDefinition(OutputDefinition),
    'MIDI Input': memoizeComponentInDefinition(MidiInputDefinition),
    'Filter': memoizeComponentInDefinition(FilterDefinition),
    'Sequencer': memoizeComponentInDefinition(SequencerDefinition),
    'Button': memoizeComponentInDefinition(ButtonDefinition),
    'Envelope': memoizeComponentInDefinition(EnvelopeDefinition),
    'Reverb': memoizeComponentInDefinition(ReverbDefinition),
    'Graph': memoizeComponentInDefinition(GraphDefinition),
};