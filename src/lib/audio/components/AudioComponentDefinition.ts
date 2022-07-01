import React from "react";
import { Plug } from "../../component-graph-canvas";
import { AudioPlug } from "../AudioPlug";

export interface AudioComponentDefinition<A, S> {
    getAudioElement?(audioContext: AudioContext): A,
    component: React.ComponentType<AudioComponentProps<A, S>>;
    initialState: S;
    inPlugs: PlugDefinition<A, S>[];
    outPlugs: PlugDefinition<A, S>[];
}

export interface AudioPlugValues {
  [plugName: string]: { value?: number };
}

export interface AudioComponentProps<A, S> {
  audioElement: A, 
  audioContext: AudioContext, 
  inPlugs: AudioPlugValues,
  state: S,
  onStateChange: React.Dispatch<React.SetStateAction<S>>;
}

export interface PlugDefinition<A, S> extends Plug {
  getAudioParameter?(audioElement: A): AudioNode | AudioParam;
  getStateParameter?(state: S): number;
}