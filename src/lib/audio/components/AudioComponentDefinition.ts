import React from "react";
import { Observable, Subject } from 'rxjs';

export interface AudioComponentDefinition<MutableState, SerializableState> {
    component: React.ComponentType<AudioComponentProps<MutableState, SerializableState>>;
    initialSerializableState: SerializableState;
    initializeMutableState(): MutableState;
    inPlugs: InPlugDefinition<MutableState, SerializableState>[];
    outPlugs: OutPlugDefinition<MutableState, SerializableState>[];
    color: string;
}

export interface InAudioPlugValues {
  number: {
    [plugName: string]: { value: number | undefined, connected: boolean }
  },
  ping: {
    [plugName: string]: { value: Observable<void> | undefined, connected: boolean }
  },
}

export interface OutAudioPlugValues {
  number: {
    [plugName: string]: { value: AudioParam | undefined, connected: boolean }
  }
}

export interface AudioComponentProps<MutableState, SerializableState> {
  mutableState: MutableState;
  serializableState: SerializableState;
  onSerializableStateChange: React.Dispatch<React.SetStateAction<SerializableState>>;
  inPlugs: InAudioPlugValues,
  outPlugs: OutAudioPlugValues;
}

export type InPlugDefinition<A, S> = NumberInPlugDefinition<A, S> | AudioInPlugDefinition<A, S> | PingInPlugDefinition<A, S>;

export interface NumberInPlugDefinition<MutableState, SerializableState> {
  name: string;
  type: 'number',
  getParameter?(mutableState: MutableState, serializableState: SerializableState): AudioParam;
}

export interface AudioInPlugDefinition<MutableState, SerializableState> {
  name: string;
  type: 'audio',
  getParameter(mutableState: MutableState, serializableState: SerializableState): AudioNode;
}

export interface PingInPlugDefinition<MutableState, SerializableState> {
  name: string;
  type: 'ping';
}

export type OutPlugDefinition<A, S> = NumberOutPlugDefinition<A, S> | AudioOutPlugDefinition<A, S> | PingOutPlugDefinition<A, S>;

export interface NumberOutPlugDefinition<MutableState, SerializableState> {
  name: string;
  type: 'number',
  getParameter?(mutableState: MutableState, serializableState: SerializableState): number;
}

export interface AudioOutPlugDefinition<MutableState, SerializableState> {
  name: string;
  type: 'audio',
  getParameter(mutableState: MutableState, serializableState: SerializableState): AudioNode;
}

export interface PingOutPlugDefinition<MutableState, SerializableState> {
  name: string;
  type: 'ping';
  getParameter(mutableState: MutableState, serializableState: SerializableState): Subject<void>,
}