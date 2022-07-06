import React from 'react';
import { Edge, Position, Node } from "../component-graph-canvas";
import { PlugWithValue } from "./AudioPlug";
import { COMPONENTS } from "./components";
import { AudioComponentDefinition, InAudioPlugValues, InPlugDefinition, OutAudioPlugValues, OutPlugDefinition } from './components/AudioComponentDefinition';

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

const getMutableStateForNodeDescription = <MutableState>(nodeDescription: NodeDescription): MutableState => {
    const definition: AudioComponentDefinition<MutableState, any> = COMPONENTS[nodeDescription.name];
  
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
    const inPlugs = collectIncomingPlugsForNode(
      nodeToNodeDescription(node),
      nodeDescriptions, 
      edges,
      nodeStates
    );

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

    const mutableState = getMutableStateForNodeDescription<MutableState>(nodeToNodeDescription(node));

    const component = React.createElement(definition.component, {
      mutableState,
      serializableState: nodeStates[node.id],
      onSerializableStateChange: onStateChange,
      inPlugs,
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
    const mutableState = getMutableStateForNodeDescription<MutableState>(nodeDescription);
  
    const definition: AudioComponentDefinition<MutableState, SerializableState> = COMPONENTS[nodeDescription.name];

    const audioComponentNode: AudioComponentNode = {
      ...nodeDescription,
      component: React.createElement("div"),
      inPlugs: definition.inPlugs.map(plug => inPlugDefinitionToPlugWithValue(plug, mutableState, serializableState)),
      outPlugs: definition.outPlugs.map(plug => outPlugDefinitionToPlugWithValue(plug, mutableState, serializableState)),
      headerColor: definition.color,
    };
  
    return audioComponentNode;
  }


  function inPlugDefinitionToPlugWithValue<MutableState, SerializableState>(plug: InPlugDefinition<MutableState, SerializableState>, mutableState: MutableState, serializableState: SerializableState): PlugWithValue {
    if (plug.type === 'audio') {
      return {
        ...plug,
        value: plug.getParameter ? plug.getParameter(mutableState, serializableState) : undefined,
        color: PLUG_TYPE_TO_COLOR_MAP[plug.type],
      }
    }
    if (plug.type === 'number') {
      return {
        ...plug,
        value: plug.getParameter ? plug.getParameter(mutableState, serializableState) : undefined,
        color: PLUG_TYPE_TO_COLOR_MAP[plug.type],
      }
    }
      return {
        ...plug,
        value: undefined,
        color: PLUG_TYPE_TO_COLOR_MAP[plug.type],
      };
  }


  function outPlugDefinitionToPlugWithValue<MutableState, SerializableState>(plug: OutPlugDefinition<MutableState, SerializableState>, mutableState: MutableState, serializableState: SerializableState): PlugWithValue {
    if (plug.type === 'audio') {
      return {
        ...plug,
        value: plug.getParameter ? plug.getParameter(mutableState, serializableState) : undefined,
        color: PLUG_TYPE_TO_COLOR_MAP[plug.type],
      }
    }
    if (plug.type === 'number') {
      return {
        ...plug,
        value: plug.getParameter ? plug.getParameter(mutableState, serializableState) : undefined,
        color: PLUG_TYPE_TO_COLOR_MAP[plug.type],
      }
    }
      return {
        ...plug,
        value: plug.getParameter ? plug.getParameter(mutableState, serializableState) : undefined,
        color: PLUG_TYPE_TO_COLOR_MAP[plug.type],
      };
  }
  
  export const nodeToNodeDescription = (node: Node): NodeDescription => ({
    id: node.id,
    name: node.name,
    position: node.position,
  });

  const collectIncomingPlugsForNode = (
    nodeDescription: NodeDescription, 
    nodeDescriptions: NodeDescription[], 
    edges: Edge[],
    nodeStates: {[nodeId: string]: any}
  ): InAudioPlugValues => {
    const incomingPlugValues: InAudioPlugValues = {
      number: {},
      ping: {},
    };

    const definition = COMPONENTS[nodeDescription.name];

    for (let inPlug of definition.inPlugs) {
      if (inPlug.type === 'number') {
        incomingPlugValues.number[inPlug.name] = {
          value: undefined,
          connected: false
        }
      }
      if (inPlug.type === 'ping') {
        incomingPlugValues.ping[inPlug.name] = {
          value: undefined,
          connected: false
        }
      }

      // TODO: find -> filter
      const edgeComingToPlug = edges.find(
        e => e.outNodeId === nodeDescription.id && e.outPlugIndex === definition.inPlugs.indexOf(inPlug)
      );
  
      if (edgeComingToPlug === undefined) continue;
  
      const incomingNodeDescription = nodeDescriptions.find(n => n.id === edgeComingToPlug.inNodeId);
  
      if (incomingNodeDescription === undefined) continue;

      const incomingNodeDefinition = COMPONENTS[incomingNodeDescription.name];
  
      const incomingNodePlug = incomingNodeDefinition.outPlugs[edgeComingToPlug.inPlugIndex - incomingNodeDefinition.inPlugs.length];

      if (incomingNodePlug.type === 'ping') {
        const value = incomingNodePlug.getParameter ? incomingNodePlug.getParameter(
          getMutableStateForNodeDescription(incomingNodeDescription), 
          nodeStates[incomingNodeDescription.id]
        ) : undefined;
        incomingPlugValues.ping[inPlug.name] = {
          value,
          connected: true,
        }
      } else if (incomingNodePlug.type === 'number') {
        const value = incomingNodePlug.getParameter ? incomingNodePlug.getParameter(
          getMutableStateForNodeDescription(incomingNodeDescription), 
          nodeStates[incomingNodeDescription.id]
        ) : undefined;

        incomingPlugValues.number[inPlug.name] = {
          value,
          connected: true,
        }
      }
    }

    return incomingPlugValues;
  }

  const collectOutgoingPlugsForNode = (
    nodeDescription: NodeDescription, 
    nodeDescriptions: NodeDescription[], 
    edges: Edge[],
    nodeStates: {[nodeId: string]: any}
  ): OutAudioPlugValues => {
    const outgoingPlugValues: OutAudioPlugValues = {
      number: {}
    };

    const definition = COMPONENTS[nodeDescription.name];

    for (let outPlug of definition.outPlugs) {

      if (outPlug.type === 'number') {
        outgoingPlugValues.number[outPlug.name] = {
          value: undefined,
          connected: false
        };
      }

      // TODO: find -> filter
      const edgeGoingFromPlug = edges.find(edge => 
        edge.inNodeId === nodeDescription.id && edge.inPlugIndex === definition.outPlugs.indexOf(outPlug) + definition.inPlugs.length
      );

      if (edgeGoingFromPlug === undefined) continue;

      const outgoingNodeDescription = nodeDescriptions.find(node => node.id === edgeGoingFromPlug.outNodeId);

      if (outgoingNodeDescription === undefined) continue;

      const outgoingNodeDefinition = COMPONENTS[outgoingNodeDescription.name];

      const outgoingNodePlug = outgoingNodeDefinition.inPlugs[edgeGoingFromPlug.outPlugIndex];

      if (outgoingNodePlug.type === 'number') {
        const value = outgoingNodePlug.getParameter ? outgoingNodePlug.getParameter(
          getMutableStateForNodeDescription(outgoingNodeDescription),
          nodeStates[outgoingNodeDescription.id],
        ) : undefined;
        outgoingPlugValues.number[outPlug.name] = { 
          value,
          connected: true,
        };
      }
    }

    return outgoingPlugValues;
  }
  