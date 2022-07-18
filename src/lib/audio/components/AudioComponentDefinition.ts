import React from "react";
import { Ping } from "../nodes/Ping";

export interface ApplicationContext {
  globalAudioContext: AudioContext;
}

export interface AudioComponentDefinition<MutableState, SerializableState> {
    component: React.ComponentType<AudioComponentProps<MutableState, SerializableState>>;
    initialSerializableState: SerializableState;
    initializeMutableState(context: ApplicationContext): MutableState;
    inPlugs: { [name: string]: InPlugDefinition<MutableState, SerializableState> };
    outPlugs: { [name: string]: OutPlugDefinition<MutableState, SerializableState> };
    color: string;
}

export interface OutAudioPlugValues {
  number: {
    [plugName: string]: { value: AudioParam | undefined, connected: boolean }
  }
  ping: {
    [plugName: string]: { value: Ping | undefined, connected: boolean }
  }
}

export interface AudioComponentProps<MutableState, SerializableState> {
  mutableState: MutableState;
  serializableState: SerializableState;
  onSerializableStateChange: React.Dispatch<React.SetStateAction<SerializableState>>;
  outPlugs: OutAudioPlugValues;
  applicationContext: ApplicationContext;
}

export type InPlugDefinition<A, S> = NumberInPlugDefinition<A, S> | AudioInPlugDefinition<A, S> | PingInPlugDefinition<A, S>;

export interface NumberInPlugDefinition<MutableState, SerializableState> {
  type: 'number',
  getParameter?(mutableState: MutableState, serializableState: SerializableState): AudioParam;
}

export interface AudioInPlugDefinition<MutableState, SerializableState> {
  type: 'audio',
  getParameter(mutableState: MutableState, serializableState: SerializableState): AudioNode;
}

export interface PingInPlugDefinition<MutableState, SerializableState> {
  type: 'ping';
  getParameter?(mutableState: MutableState, serializableState: SerializableState): Ping;
}

export type OutPlugDefinition<A, S> = NumberOutPlugDefinition<A, S> | AudioOutPlugDefinition<A, S> | PingOutPlugDefinition<A, S>;

export interface NumberOutPlugDefinition<MutableState, SerializableState> {
  type: 'number';
}

export interface AudioOutPlugDefinition<MutableState, SerializableState> {
  type: 'audio';
  getParameter(mutableState: MutableState, serializableState: SerializableState): AudioNode;
}

export interface PingOutPlugDefinition<MutableState, SerializableState> {
  type: 'ping';
}