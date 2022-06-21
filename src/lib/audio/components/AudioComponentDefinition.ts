import { Observable } from "rxjs";
import { Plug } from "../../component-graph-canvas";
import { AudioPlug, AudioPlugWithAudioParameter } from "../AudioPlug";

export interface AudioComponentDefinition<A extends (AudioNode | Observable<number>)> {
    getAudioElement(audioContext: AudioContext): A,
    component: React.ComponentType<AudioComponentProps<A>>;
    inPlugs: PlugDefinition<A>[];
    outPlugs: PlugDefinition<A>[];
  }

export interface AudioComponentProps<A> {
  audioElement: A, 
  audioContext: AudioContext, 
  inPlugs: { [name: string]: AudioPlugWithAudioParameter}
}

export interface PlugDefinition<A> extends Plug {
  getAudioParameter(audioElement: A): AudioNode | AudioParam |  Observable<number> | undefined;
}