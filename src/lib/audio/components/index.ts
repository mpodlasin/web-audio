import { Plug } from "../../component-graph-canvas";
import { Gain } from "./Gain";
import { Oscillator } from "./Oscillator";
import { Output } from "./Output";

export interface AudioComponentDefinition<A extends AudioNode> {
    getAudioElement(audioContext: AudioContext): A,
    component: React.ComponentType<{audioElement: A, audioContext: AudioContext}>;
    inPlugs: Plug[];
    outPlugs: Plug[];
  }
  
export interface ComponentDefinitions {
    [index: string]: AudioComponentDefinition<any>;
  }

export const COMPONENTS: ComponentDefinitions = {
    'Oscillator': {
        component: Oscillator,
        getAudioElement: audioContext => new OscillatorNode(audioContext),
        inPlugs: [],
        outPlugs: [
          {
            type: 'audio',
            name: 'Output'
          }
        ],
    },
    'Gain': {
      component: Gain,
      getAudioElement: audioContext => new GainNode(audioContext),
      inPlugs: [
        {
          type: 'audio',
          name: 'Input'
        }
      ],
      outPlugs: [
        {
          type: 'audio',
          name: 'Output'
        }
      ],
    },
    'Output': {
      component: Output,
      getAudioElement: audioContext => audioContext.destination,
      inPlugs: [
        {
          type: 'audio',
          name: 'Input'
        }
      ],
      outPlugs: [],
    }
  };