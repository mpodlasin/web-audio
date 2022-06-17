import { Observable, Subject } from "rxjs";
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
  audioElement: A | Observable<number>;
}

interface PlugDefinitions {
  [type: string]: {
    possibleInputs: {
      [type: string]: {
        connect<A extends AudioNode, B extends AudioNode>(a: AudioPlug<A>, b: AudioPlug<B>): undefined | (() => void);
      }
    }
  }
};

export const PLUGS: PlugDefinitions = {
  'audio': {
    possibleInputs: {
      'audio': {
        connect(a: AudioPlug<AudioNode>, b: AudioPlug<AudioNode>) {
          if (a.audioElement instanceof AudioNode && b.audioElement instanceof AudioNode) {
            a.audioElement.connect(b.audioElement);
          }

          return () => {
            if (a.audioElement instanceof AudioNode && b.audioElement instanceof AudioNode) {
              a.audioElement.disconnect(b.audioElement);
            }
          }
        },
      }
    }
  },
  'frequency': {
    possibleInputs: {
      'frequency': {
        connect(a: AudioPlug<AudioNode>, b: AudioPlug<AudioNode>) {
          if (b.audioElement instanceof OscillatorNode && a.audioElement instanceof Observable) {
            const subscription = a.audioElement.subscribe(value => {
              if (b.audioElement instanceof OscillatorNode) { // second check because typechecking gets picky
                b.audioElement.frequency.value = value;
              }
            });

            return () => {
              subscription.unsubscribe();
            }
          }
        },
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
            type: 'frequency',
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
      getAudioElement: () => new Subject<number>(),
      inPlugs: [],
      outPlugs: [
        {
          type: 'frequency',
          name: 'Frequency',
        }
      ],
    }
  };