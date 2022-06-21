import React from 'react';
import { Edge, Position, Node } from "../component-graph-canvas";
import { AudioPlug } from "./AudioPlug";
import { COMPONENTS } from "./components";

export interface NodeDescription {
    id: string;
    name: string;
    position: Position;
  }
  
export interface AudioComponentNode extends Node {
    audioElement: AudioNode;
    inPlugs: AudioPlug[];
    outPlugs: AudioPlug[];
}

const GLOBAL_AUDIO_CONTEXT = new AudioContext();

const nodeIdToAudioElement = new Map<string, AudioNode>();

const getAudioElementForNodeDescription = (nodeDescription: NodeDescription) => {
    const definition = COMPONENTS[nodeDescription.name];
  
    let audioElement: AudioNode;
    if (nodeIdToAudioElement.has(nodeDescription.id)) {
      audioElement = nodeIdToAudioElement.get(nodeDescription.id)!;
    } else {
      audioElement = definition.getAudioElement(GLOBAL_AUDIO_CONTEXT);
  
      nodeIdToAudioElement.set(nodeDescription.id, audioElement);
    }
  
    return audioElement;
  }
  
export const nodeDescriptionToAudioNode = (
    nodeDescription: NodeDescription, 
    nodeDescriptions: NodeDescription[], 
    edges: Edge[]
  ): AudioComponentNode => {
    const audioElement = getAudioElementForNodeDescription(nodeDescription);
  
    const definition = COMPONENTS[nodeDescription.name];
  
    const inPlugs = definition.inPlugs.reduce((inPlugs, inPlug, i) => {
      const edgeComingToPlug = edges.find(
        e => e.outNodeId === nodeDescription.id && e.outPlugIndex === i
      );
  
      if (edgeComingToPlug === undefined) return inPlugs;
  
      const incomingNodeDescription = nodeDescriptions.find(n => n.id === edgeComingToPlug.inNodeId);
  
      if (incomingNodeDescription === undefined) return inPlugs;
  
      const incomingAudioElement = getAudioElementForNodeDescription(incomingNodeDescription);
  
      const incomingNodeDefinition = COMPONENTS[incomingNodeDescription.name];
  
      const incomingNodePlug = incomingNodeDefinition.outPlugs[edgeComingToPlug.inPlugIndex - incomingNodeDefinition.inPlugs.length];
  
      return {
        ...inPlugs,
        [inPlug.name]: { 
          ...inPlug,
          audioParameter: incomingNodePlug.getAudioParameter(incomingAudioElement)
        },
      };
    }, {} as {[name: string]: AudioPlug});
  
    const component = React.createElement(definition.component, {
      audioElement, 
      audioContext: GLOBAL_AUDIO_CONTEXT, 
      inPlugs,
    });
  
    const audioComponentNode = {
      ...nodeDescription,
      component,
      inPlugs: definition.inPlugs.map(plug => ({
        ...plug,
        audioParameter: plug.getAudioParameter(audioElement),
      })),
      outPlugs: definition.outPlugs.map(plug => ({
        ...plug,
        audioParameter: plug.getAudioParameter(audioElement),
      })),
      audioElement,
    };
  
    return audioComponentNode;
  }
  
  export const nodeDescriptionsToAudioNodes = (nodeDescriptions: NodeDescription[], edges: Edge[]): AudioComponentNode[] => {
    return nodeDescriptions.map(nodeDescription => nodeDescriptionToAudioNode(nodeDescription, nodeDescriptions, edges))
  }
  
  export const nodeToNodeDescription = (node: Node): NodeDescription => ({
    id: node.id,
    name: node.name,
    position: node.position,
  });
  