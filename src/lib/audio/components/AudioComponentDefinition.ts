import React from "react";
import { Observable, Subject } from 'rxjs';

export interface AudioComponentDefinition<MutableState, SerializableState> {
    component: React.ComponentType<AudioComponentProps<MutableState, SerializableState>>;
    initialSerializableState: SerializableState;
    initializeMutableState(): MutableState;
    inPlugs: PlugDefinition<MutableState, SerializableState>[];
    outPlugs: PlugDefinition<MutableState, SerializableState>[];
    color: string;
}

export interface AudioPlugValues {
  number: {
    [plugName: string]: number | undefined
  },
  ping: {
    [plugName: string]: Observable<void> | undefined
  },
}

export interface AudioComponentProps<MutableState, SerializableState> {
  mutableState: MutableState;
  serializableState: SerializableState;
  onSerializableStateChange: React.Dispatch<React.SetStateAction<SerializableState>>;
  inPlugs: AudioPlugValues,
}

export type PlugDefinition<A, S> = NumberPlugDefinition<A, S> | AudioPlugDefinition<A, S> | PingPlugDefinition<A, S>;

export interface NumberPlugDefinition<MutableState, SerializableState> {
  name: string;
  type: 'number',
  getParameter?(mutableState: MutableState, serializableState: SerializableState): number | AudioParam;
}

export interface AudioPlugDefinition<MutableState, SerializableState> {
  name: string;
  type: 'audio',
  getParameter?(mutableState: MutableState, serializableState: SerializableState): AudioNode;
}

export interface PingPlugDefinition<MutableState, SerializableState> {
  name: string;
  type: 'ping';
  getParameter?(mutableState: MutableState, serializableState: SerializableState): Subject<void>,
}