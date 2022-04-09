import React from 'react';

export const useAudioContext = () => {
    const ref = React.useRef<AudioContext>();
  
    if (!ref.current) {
      ref.current = new AudioContext();
    }
  
    return ref.current;
  };
  
export const useOscillator = (audioContext: AudioContext) => {
    const ref = React.useRef<OscillatorNode>();
  
    if (!ref.current) {
      ref.current = audioContext.createOscillator();
      ref.current.start();
    }
  
    return ref.current;
  };
  
export const useGain = (audioContext: AudioContext) => {
    const ref = React.useRef<GainNode>();
  
    if (!ref.current) {
      ref.current = audioContext.createGain();
    }
  
    return ref.current;
  };
  
export const useConnect = (source: AudioNode, desination: AudioNode) => {
    React.useEffect(() => {
      source.connect(desination);
  
      return () => {
        source.disconnect(desination);
      }
    });
  };