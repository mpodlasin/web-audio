import { Observable, Subject } from "rxjs";
import { Plug } from "../../component-graph-canvas";
import { AudioPlug } from "../AudioPlug";
import { Gain } from "./Gain";
import { MidiInput } from "./MidiInput";
import { Number } from "./Number";
import { Oscillator } from "./Oscillator";
import { Output } from "./Output";

export interface ComponentDefinitions {
  [index: string]: AudioComponentDefinition<any>;
}

export interface AudioComponentDefinition<A extends (AudioNode | Observable<number>)> {
    getAudioElement(audioContext: AudioContext): A,
    component: React.ComponentType<{audioElement: A, audioContext: AudioContext, inPlugs: { [name: string]: AudioPlug}}>;
    inPlugs: PlugDefinition<A>[];
    outPlugs: PlugDefinition<A>[];
  }

export interface PlugDefinition<A> extends Plug {
  getAudioParameter(audioElement: A): AudioNode | AudioParam |  Observable<number>;
}

export const COMPONENTS: ComponentDefinitions = {
    'Oscillator': {
        component: Oscillator,
        getAudioElement: audioContext => new OscillatorNode(audioContext),
        inPlugs: [
          {
            type: 'number',
            name: 'Frequency',
            getAudioParameter: audioElement => audioElement.frequency,
          }
        ],
        outPlugs: [
          {
            type: 'audio',
            name: 'Output',
            getAudioParameter: audioElement => audioElement,
          }
        ],
    } as AudioComponentDefinition<OscillatorNode>,
    'Gain': {
      component: Gain,
      getAudioElement: audioContext => new GainNode(audioContext),
      inPlugs: [
        {
          type: 'audio',
          name: 'Input',
          getAudioParameter: audioElement => audioElement,
        }
      ],
      outPlugs: [
        {
          type: 'audio',
          name: 'Output',
          getAudioParameter: audioElement => audioElement,
        }
      ],
    } as AudioComponentDefinition<GainNode>,
    'Output': {
      component: Output,
      getAudioElement: audioContext => audioContext.destination,
      inPlugs: [
        {
          type: 'audio',
          name: 'Input',
          getAudioParameter: audioElement => audioElement,
        }
      ],
      outPlugs: [],
    } as AudioComponentDefinition<AudioDestinationNode>,
    'MIDI Input': {
      component: MidiInput,
      getAudioElement: () => new Subject(),
      inPlugs: [],
      outPlugs: [
        {
          type: 'number',
          name: 'Frequency',
          getAudioParameter: audioElement => audioElement,
        }
      ],
    } as AudioComponentDefinition<Subject<number>>,
    'Number': {
      component: Number,
      getAudioElement: () => new Subject(),
      inPlugs: [],
      outPlugs: [
        {
          type: 'number',
          name: 'Number',
          getAudioParameter: audioElement => audioElement,
        },
      ]
    }
  };