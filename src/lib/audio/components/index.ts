import { Observable, Subject } from "rxjs";
import { Plug } from "../../component-graph-canvas";
import { Gain } from "./Gain";
import { MidiInput } from "./MidiInput";
import { Oscillator } from "./Oscillator";
import { Output } from "./Output";

interface PlugWithAudioElement<A> extends Plug {
  getAudioParameter(audioElement: A): AudioNode | AudioParam |  Observable<number>;
}

export interface AudioComponentDefinition<A extends (AudioNode | Observable<number>)> {
    getAudioElement(audioContext: AudioContext): A,
    component: React.ComponentType<{audioElement: A, audioContext: AudioContext}>;
    inPlugs: PlugWithAudioElement<A>[];
    outPlugs: PlugWithAudioElement<A>[];
  }
  
export interface ComponentDefinitions {
    [index: string]: AudioComponentDefinition<any>;
}

// AudioNode -> AudioNode/AudioParam
// a.connect(b);

// Observable<number> -> AudioParam
// a.subscribe(val => b.value = val);

export interface AudioPlug extends Plug {
  audioParameter: AudioNode | AudioParam |  Observable<number>;
}

export const connectPlugs = (a: AudioPlug, b: AudioPlug) => {
  const firstAudioParameter = a.audioParameter;
  const secondAudioParameter = b.audioParameter;

  if (firstAudioParameter instanceof AudioNode && secondAudioParameter instanceof AudioNode) {
    firstAudioParameter.connect(secondAudioParameter);

    return () => {
      firstAudioParameter.disconnect(secondAudioParameter);
    }
  }

  if (firstAudioParameter instanceof AudioNode && secondAudioParameter instanceof AudioParam) {
    firstAudioParameter.connect(secondAudioParameter);

    return () => {
      firstAudioParameter.disconnect(secondAudioParameter);
    }
  }

  if (firstAudioParameter instanceof Observable && secondAudioParameter instanceof AudioParam) {
    const subscription = firstAudioParameter.subscribe(value => {
      secondAudioParameter.value = value;
    });

    return () => {
      subscription.unsubscribe();
    }
  }

  throw new Error();
};

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
  };