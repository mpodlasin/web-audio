import React from 'react';
import { Edge, Position, Node } from "../component-graph-canvas";
import { AudioPlug, AudioPlugWithAudioParameter } from "./AudioPlug";
import { COMPONENTS } from "./components";

export interface NodeDescription {
    id: string;
    name: string;
    position: Position;
    serializedData?: any;
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

      const getAudioParameterForIncomingNodePlug = incomingNodePlug.getAudioParameter;
  
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
  
  export const nodeDescriptionsToAudioNodes = (nodeDescriptions: NodeDescription[], edges: Edge[], deserializeDescriptionData = false): AudioComponentNode[] => {
    const audioNodes = nodeDescriptions.map(nodeDescription => nodeDescriptionToAudioNode(nodeDescription, nodeDescriptions, edges));

    if (deserializeDescriptionData) {
      nodeDescriptions.forEach(deserializeData);
    }

    return audioNodes;
  }
  
  export const nodeToNodeDescription = (node: AudioComponentNode): NodeDescription => ({
    id: node.id,
    name: node.name,
    position: node.position,
    serializedData: serializeData(node),
  });

  const serializeData = (node: AudioComponentNode): any => {
    const audioElement = node.audioElement;

    if (audioElement instanceof OscillatorNode) {
      return {
        frequency: audioElement.frequency.value,
      };
    }

    return {};
  }

  const deserializeData = (nodeDescription: NodeDescription): void => {
    const serializedData = nodeDescription.serializedData;

    const audioElement = getAudioElementForNodeDescription(nodeDescription);

    if (audioElement instanceof OscillatorNode) {
      audioElement.frequency.value = serializedData.frequency;
    }
  }
  