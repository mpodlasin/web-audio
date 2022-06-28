import React from 'react';
import { Edge, Position, Node } from "../component-graph-canvas";
import { AudioPlug, AudioPlugWithAudioParameter } from "./AudioPlug";
import { COMPONENTS } from "./components";
import { AudioComponentDefinition } from './components/AudioComponentDefinition';

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

  export const nodeDescriptionsToAudioNodes = (
    nodeDescriptions: NodeDescription[], 
    edges: Edge[],
    states: {[nodeId: string]: any},
    setStates: React.Dispatch<React.SetStateAction<{[nodeId: string]: any}>>,
  ): AudioComponentNode[] => {
    const handleStateChange = (nodeId: string) => (setState: React.SetStateAction<any>) => {
      if (setState instanceof Function) {
        setStates(states => ({...states, [nodeId]: setState(states[nodeId])}))
      } else {
        setStates(states => ({...states, [nodeId]: setState}));
      }
    };

    const audioNodes = nodeDescriptions.map(
      nodeDescription => nodeDescriptionToAudioNode(
        nodeDescription, 
        nodeDescriptions, 
        edges, 
        states[nodeDescription.id],
        handleStateChange(nodeDescription.id),
        states,
      )
    );

    return audioNodes;
  };
  
const nodeDescriptionToAudioNode = <S>(
    nodeDescription: NodeDescription, 
    nodeDescriptions: NodeDescription[], 
    edges: Edge[],
    state: S | undefined,
    setState: React.Dispatch<React.SetStateAction<S>>,
    nodeStates: {[nodeId: string]: any},
  ): AudioComponentNode => {
    const audioElement = getAudioElementForNodeDescription(nodeDescription);
  
    const definition: AudioComponentDefinition<any, S> = COMPONENTS[nodeDescription.name];

    const inPlugs = collectIncomingPlugsForNode(nodeDescription, nodeDescriptions, edges, nodeStates);
  
    const component = React.createElement(definition.component, {
      audioElement, 
      audioContext: GLOBAL_AUDIO_CONTEXT, 
      inPlugs,
      state: state || definition.initialState!,
      onStateChange: setState,
    });
  
    const audioComponentNode = {
      ...nodeDescription,
      component,
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
  ) => {
    const definition = COMPONENTS[nodeDescription.name];

    return definition.inPlugs.reduce((inPlugs, inPlug, i) => {
      const edgeComingToPlug = edges.find(
        e => e.outNodeId === nodeDescription.id && e.outPlugIndex === i
      );
  
      if (edgeComingToPlug === undefined) return inPlugs;
  
      const incomingNodeDescription = nodeDescriptions.find(n => n.id === edgeComingToPlug.inNodeId);
  
      if (incomingNodeDescription === undefined) return inPlugs;
  
      const incomingAudioElement = getAudioElementForNodeDescription(incomingNodeDescription);
  
      const incomingNodeDefinition = COMPONENTS[incomingNodeDescription.name];
  
      const incomingNodePlug = incomingNodeDefinition.outPlugs[edgeComingToPlug.inPlugIndex - incomingNodeDefinition.inPlugs.length];

      const getAudioParameterForIncomingNodePlug = incomingNodePlug.getAudioParameter;
      const getStateParameterForIncomingNodePlug = incomingNodePlug.getStateParameter;
  
      if (getAudioParameterForIncomingNodePlug === undefined && getStateParameterForIncomingNodePlug !== undefined) {
        const stateParameter = getStateParameterForIncomingNodePlug(nodeStates[incomingNodeDescription.id] || incomingNodeDefinition.initialState);

        return {
          ...inPlugs,
          [inPlug.name]: {
            ...inPlug,
            audioParameter: null as any,
            value: stateParameter,
          }
        }
      }

      if (getAudioParameterForIncomingNodePlug === undefined) return inPlugs;

      const incomingAudioParameter = getAudioParameterForIncomingNodePlug(incomingAudioElement);

      return {
        ...inPlugs,
        [inPlug.name]: { 
          ...inPlug,
          audioParameter: incomingAudioParameter,
        },
      };
    }, {} as {[name: string]: AudioPlugWithAudioParameter});
  };
  