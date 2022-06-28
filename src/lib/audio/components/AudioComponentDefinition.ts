import React from "react";
import { Observable } from "rxjs";
import { Plug } from "../../component-graph-canvas";
import { AudioPlugWithAudioParameter } from "../AudioPlug";

export interface AudioComponentDefinition<A, S> {
    getAudioElement?(audioContext: AudioContext): A,
    component: React.ComponentType<AudioComponentProps<A, S>>;
    initialState: S;
    inPlugs: PlugDefinition<A, S>[];
    outPlugs: PlugDefinition<A, S>[];
  }

export interface AudioComponentProps<A, S> {
  audioElement: A, 
  audioContext: AudioContext, 
  inPlugs: { [name: string]: AudioPlugWithAudioParameter}
  state: S,
  onStateChange: React.Dispatch<React.SetStateAction<S>>;
}

export interface PlugDefinition<A, S> extends Plug {
  getAudioParameter?(audioElement: A): AudioNode | AudioParam |  Observable<number>;
  getStateParameter?(state: S): number;
}