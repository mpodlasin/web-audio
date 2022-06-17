import { Plug } from "../../component-graph-canvas";
import { Gain } from "./Gain";
import { MidiInput } from "./MidiInput";
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

interface AudioPlug<A extends AudioNode> {
  audioElement: A;
}

interface PlugDefinitions {
  [type: string]: {
    possibleInputs: {
      [type: string]: {
        connect<A extends AudioNode, B extends AudioNode>(a: AudioPlug<A>, b: AudioPlug<B>): void;

        disconnect<A extends AudioNode, B extends AudioNode>(a: AudioPlug<A>, b: AudioPlug<B>): void;
      }
    }
  }
};

export const PLUGS: PlugDefinitions = {
  'audio': {
    possibleInputs: {
      'audio': {
        connect<A extends AudioNode, B extends AudioNode>(a: AudioPlug<A>, b: AudioPlug<B>) {
          a.audioElement.connect(b.audioElement);
        },

        disconnect<A extends AudioNode, B extends AudioNode>(a: AudioPlug<A>, b: AudioPlug<B>) {
          a.audioElement.disconnect(b.audioElement);
        }
      }
    }
  }
};

export const COMPONENTS: ComponentDefinitions = {
    'Oscillator': {
        component: Oscillator,
        getAudioElement: audioContext => new OscillatorNode(audioContext),
        inPlugs: [
          {
            type: 'number',
            name: 'Frequency'
          }
        ],
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
    },
    'MIDI Input': {
      component: MidiInput,
      getAudioElement: () => undefined,
      inPlugs: [],
      outPlugs: [
        {
          type: 'number',
          name: 'Frequency',
        }
      ],
    }
  };