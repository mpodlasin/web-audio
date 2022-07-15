import React from 'react';
import { Edge, Position, Node } from "../component-graph-canvas";
import { PlugWithValue } from "./AudioPlug";
import { ComponentDefinitions, COMPONENTS } from "./components";
import { AudioComponentDefinition, InPlugDefinition, OutAudioPlugValues, OutPlugDefinition } from './components/AudioComponentDefinition';
import { AggregatedAudioParam } from './nodes/AggregatedAudioParam';
import { AggregatedPing } from './nodes/AggregatedPing';

export interface NodeDescription {
    id: string;
    name: string;
    position: Position;
  }
  
export interface AudioComponentNode extends Node {
    inPlugs: PlugWithValue[];
    outPlugs: PlugWithValue[];
}

const NODE_ID_TO_MUTABLE_STATE = new Map<string, any>();

const getMutableStateForNodeDescription = <MutableState>(nodeDescription: NodeDescription, componentDefinitions: ComponentDefinitions): MutableState => {
    const definition: AudioComponentDefinition<MutableState, any> = componentDefinitions[nodeDescription.name];
  
    if (NODE_ID_TO_MUTABLE_STATE.has(nodeDescription.id)) {
      return NODE_ID_TO_MUTABLE_STATE.get(nodeDescription.id)!;
    } else {
      const mutableState = definition.initializeMutableState();
      
      NODE_ID_TO_MUTABLE_STATE.set(nodeDescription.id, mutableState);

      return mutableState;
    }
  }

  export const nodeDescriptionsToAudioNodes = (nodeDescriptions: NodeDescription[]): AudioComponentNode[] => {
    return nodeDescriptions.map(nodeDescriptionToAudioNode);
  };


export const addComponentsToAudioComponentNodes = (
  nodes: AudioComponentNode[],
  edges: Edge[],
  nodeStates: {[nodeId: string]: any},
  setNodeStates: React.Dispatch<React.SetStateAction<{[nodeId: string]: any}>>,
) => {
  return nodes.map(node => addComponentToAudioComponentNode(
    node,
    nodes.map(nodeToNodeDescription),
    edges,
    nodeStates,
    setNodeStates
  ))
}

const addComponentToAudioComponentNode = <MutableState, SerializableState>(
    node: AudioComponentNode,
    nodeDescriptions: NodeDescription[], 
    edges: Edge[],
    nodeStates: {[nodeId: string]: any},
    setNodeStates: React.Dispatch<React.SetStateAction<{[nodeId: string]: any}>>,
  ): AudioComponentNode => {
    const definition = COMPONENTS[node.name];

    const outPlugs = collectOutgoingPlugsForNode(
      nodeToNodeDescription(node),
      nodeDescriptions, 
      edges,
      nodeStates
    );

    const onStateChange = (action: React.SetStateAction<SerializableState>) => {
      if (action instanceof Function) {
        setNodeStates(states => ({...states, [node.id]: action(states[node.id])}))
      } else {
        setNodeStates(states => ({...states, [node.id]: action}))
      }
    }

    const mutableState = getMutableStateForNodeDescription<MutableState>(nodeToNodeDescription(node), COMPONENTS);

    const component = React.createElement(definition.component, {
      mutableState,
      serializableState: nodeStates[node.id],
      onSerializableStateChange: onStateChange,
      outPlugs,
    });

    return {
      ...node,
      component
    }
  }

const PLUG_TYPE_TO_COLOR_MAP: {[type: string]: string} = {
  'number': 'lightcyan',
  'audio': 'lightblue',
};
  
const nodeDescriptionToAudioNode = <MutableState, SerializableState>(
  nodeDescription: NodeDescription,
  serializableState: SerializableState,
  ): AudioComponentNode => {
    const mutableState = getMutableStateForNodeDescription<MutableState>(nodeDescription, COMPONENTS);
  
    const definition: AudioComponentDefinition<MutableState, SerializableState> = COMPONENTS[nodeDescription.name];

    const audioComponentNode: AudioComponentNode = {
      ...nodeDescription,
      component: React.createElement("div"),
      inPlugs: Object.entries(definition.inPlugs).map(([plugName, plug]) => inPlugDefinitionToPlugWithValue(plugName, plug, mutableState, serializableState)),
      outPlugs: Object.entries(definition.outPlugs).map(([plugName, plug]) => outPlugDefinitionToPlugWithValue(plugName, plug, mutableState, serializableState)),
      headerColor: definition.color,
    };
  
    return audioComponentNode;
  }


  function inPlugDefinitionToPlugWithValue<MutableState, SerializableState>(plugName: string, plug: InPlugDefinition<MutableState, SerializableState>, mutableState: MutableState, serializableState: SerializableState): PlugWithValue {
    if (plug.type === 'audio') {
      return {
        ...plug,
        name: plugName,
        value: plug.getParameter ? plug.getParameter(mutableState, serializableState) : undefined,
        color: PLUG_TYPE_TO_COLOR_MAP[plug.type],
      }
    }
    if (plug.type === 'number') {
      return {
        ...plug,
        name: plugName,
        value: plug.getParameter ? plug.getParameter(mutableState, serializableState) : undefined,
        color: PLUG_TYPE_TO_COLOR_MAP[plug.type],
      }
    }
      return {
        ...plug,
        name: plugName,
        value: undefined,
        color: PLUG_TYPE_TO_COLOR_MAP[plug.type],
      };
  }


  function outPlugDefinitionToPlugWithValue<MutableState, SerializableState>(plugName: string, plug: OutPlugDefinition<MutableState, SerializableState>, mutableState: MutableState, serializableState: SerializableState): PlugWithValue {
    if (plug.type === 'audio') {
      return {
        ...plug,
        name: plugName,
        value: plug.getParameter ? plug.getParameter(mutableState, serializableState) : undefined,
        color: PLUG_TYPE_TO_COLOR_MAP[plug.type],
      }
    }
    if (plug.type === 'number') {
      return {
        ...plug,
        name: plugName,
        value: plug.getParameter ? plug.getParameter(mutableState, serializableState) : undefined,
        color: PLUG_TYPE_TO_COLOR_MAP[plug.type],
      }
    }
      return {
        ...plug,
        name: plugName,
        value: plug.getParameter ? plug.getParameter(mutableState, serializableState) : undefined,
        color: PLUG_TYPE_TO_COLOR_MAP[plug.type],
      };
  }
  
  export const nodeToNodeDescription = (node: Node): NodeDescription => ({
    id: node.id,
    name: node.name,
    position: node.position,
  });

export const injectableCollectOutgoingPlugsForNode = (componentDefinitions: ComponentDefinitions) => (
  nodeDescription: NodeDescription, 
  nodeDescriptions: NodeDescription[], 
  edges: Edge[],
  nodeStates: {[nodeId: string]: any}
): OutAudioPlugValues => {
  const outgoingPlugValues: OutAudioPlugValues = {
    number: {},
    ping: {}
  };

  const definition = componentDefinitions[nodeDescription.name];

  for (let [outPlugName, outPlug] of Object.entries(definition.outPlugs)) {

    const edgesGoingFromPlug = edges.filter(edge => 
      edge.inNodeId === nodeDescription.id && edge.inPlugName === outPlugName
    );

    if (outPlug.type === 'number') {
      outgoingPlugValues.number[outPlugName] = {
        value: undefined,
        connected: false
      };

      const result = edgesGoingFromPlug.flatMap(edgeGoingFromPlug => {
        if (edgeGoingFromPlug === undefined) return [];

        const outgoingNodeDescription = nodeDescriptions.find(node => node.id === edgeGoingFromPlug.outNodeId);
  
        if (outgoingNodeDescription === undefined) return [];
  
        const outgoingNodeDefinition = componentDefinitions[outgoingNodeDescription.name];
  
        const outgoingNodePlug = outgoingNodeDefinition.inPlugs[edgeGoingFromPlug.outPlugName];
  
        if (outgoingNodePlug.type === 'number') {
          const value = outgoingNodePlug.getParameter ? outgoingNodePlug.getParameter(
            getMutableStateForNodeDescription(outgoingNodeDescription, componentDefinitions),
            nodeStates[outgoingNodeDescription.id],
          ) : undefined;
          return value ? [value] : [];
        }

        return [];
      });

      if (result.length > 1) {
        outgoingPlugValues.number[outPlugName] = {
          value: new AggregatedAudioParam(result),
          connected: true
        };
      }

      if (result.length === 1) {
        outgoingPlugValues.number[outPlugName] = {
          value: result[0],
          connected: true
        };
      }

      continue;
    } else if (outPlug.type === 'ping') {
      outgoingPlugValues.ping[outPlugName] = {
        value: undefined,
        connected: false
      };

      const result = edgesGoingFromPlug.flatMap(edgeGoingFromPlug => {
        if (edgeGoingFromPlug === undefined) return [];

        const outgoingNodeDescription = nodeDescriptions.find(node => node.id === edgeGoingFromPlug.outNodeId);
  
        if (outgoingNodeDescription === undefined) return [];
  
        const outgoingNodeDefinition = componentDefinitions[outgoingNodeDescription.name];
  
        const outgoingNodePlug = outgoingNodeDefinition.inPlugs[edgeGoingFromPlug.outPlugName];
  
        if (outgoingNodePlug.type === 'ping') {
          const value = outgoingNodePlug.getParameter ? outgoingNodePlug.getParameter(
            getMutableStateForNodeDescription(outgoingNodeDescription, componentDefinitions),
            nodeStates[outgoingNodeDescription.id],
          ) : undefined;
          return value ? [value] : [];
        }

        return [];
      });

      if (result.length > 0) {
        outgoingPlugValues.ping[outPlugName] = {
          value: new AggregatedPing(result),
          connected: true
        };
      }

      continue;
    }
  }

  return outgoingPlugValues;
}

const collectOutgoingPlugsForNode = injectableCollectOutgoingPlugsForNode(COMPONENTS);