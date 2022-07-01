import React from 'react';
import { Edge, Position, Node } from "../component-graph-canvas";
import { AudioPlug } from "./AudioPlug";
import { COMPONENTS } from "./components";
import { AudioComponentDefinition, AudioPlugValues } from './components/AudioComponentDefinition';

export interface NodeDescription {
    id: string;
    name: string;
    position: Position;
  }
  
export interface AudioComponentNode extends Node {
    audioElement?: AudioNode;
    inPlugs: AudioPlug[];
    outPlugs: AudioPlug[];
}

const GLOBAL_AUDIO_CONTEXT = new AudioContext();

const nodeIdToAudioElement = new Map<string, AudioNode>();

const getAudioElementForNodeDescription = (nodeDescription: NodeDescription): AudioNode | undefined => {
    const definition = COMPONENTS[nodeDescription.name];
  
    if (nodeIdToAudioElement.has(nodeDescription.id)) {
      return nodeIdToAudioElement.get(nodeDescription.id)!;
    } else if (definition.getAudioElement) {
      const audioElement = definition.getAudioElement(GLOBAL_AUDIO_CONTEXT)!;
  
      nodeIdToAudioElement.set(nodeDescription.id, audioElement);

      return audioElement;
    }

    return undefined;
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

const addComponentToAudioComponentNode = <S>(
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

    const onStateChange = (action: React.SetStateAction<S>) => {
      if (action instanceof Function) {
        setNodeStates(states => ({...states, [node.id]: action(states[node.id])}))
      } else {
        setNodeStates(states => ({...states, [node.id]: action}))
      }
    }

    const component = React.createElement(definition.component, {
      audioElement: node.audioElement,
      audioContext: GLOBAL_AUDIO_CONTEXT,
      inPlugs,
      state: nodeStates[node.id],
      onStateChange,
    });

    return {
      ...node,
      component
    }
  }
  
const nodeDescriptionToAudioNode = <S>(nodeDescription: NodeDescription): AudioComponentNode => {
    const audioElement = getAudioElementForNodeDescription(nodeDescription);
  
    const definition: AudioComponentDefinition<any, S> = COMPONENTS[nodeDescription.name];

    const audioComponentNode = {
      ...nodeDescription,
      component: React.createElement("div"),
      inPlugs: definition.inPlugs.map(plug => ({
        ...plug,
        audioParameter: plug.getAudioParameter !== undefined ?  plug.getAudioParameter(audioElement) : undefined,
      })),
      outPlugs: definition.outPlugs.map(plug => ({
        ...plug,
        audioParameter:  plug.getAudioParameter !== undefined ?  plug.getAudioParameter(audioElement) : undefined,
      })),
      audioElement,
    };
  
    return audioComponentNode;
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
  ): AudioPlugValues => {
    const incomingPlugValues: AudioPlugValues = {};

    const definition = COMPONENTS[nodeDescription.name];

    for (let inPlug of definition.inPlugs) {
      incomingPlugValues[inPlug.name] = { value: undefined };

      const edgeComingToPlug = edges.find(
        e => e.outNodeId === nodeDescription.id && e.outPlugIndex === definition.inPlugs.indexOf(inPlug)
      );
  
      if (edgeComingToPlug === undefined) continue;
  
      const incomingNodeDescription = nodeDescriptions.find(n => n.id === edgeComingToPlug.inNodeId);
  
      if (incomingNodeDescription === undefined) continue;

      const incomingNodeDefinition = COMPONENTS[incomingNodeDescription.name];
  
      const incomingNodePlug = incomingNodeDefinition.outPlugs[edgeComingToPlug.inPlugIndex - incomingNodeDefinition.inPlugs.length];

      const getStateParameterForIncomingNodePlug = incomingNodePlug.getStateParameter;
  
      if (getStateParameterForIncomingNodePlug !== undefined) {
        const stateParameter = getStateParameterForIncomingNodePlug(nodeStates[incomingNodeDescription.id] || incomingNodeDefinition.initialState);

        incomingPlugValues[inPlug.name] = { value: stateParameter };
      }
    }

    return incomingPlugValues;
  }
  