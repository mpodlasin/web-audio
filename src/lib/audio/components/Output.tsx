import React from 'react';
import { AudioComponentDefinition } from './AudioComponentDefinition';

export const OutputDefinition: AudioComponentDefinition<AudioDestinationNode, void> = {
  component: Output,
  getAudioElement: audioContext => audioContext.destination,
  initialState: undefined,
  inPlugs: [
    {
      type: 'audio',
      name: 'Input',
      getAudioParameter: audioElement => audioElement,
    }
  ],
  outPlugs: [],
};

export function Output({ audioContext }: { audioContext: AudioContext }) {
    const [audioContextState, setAudioContextState] = React.useState(audioContext.state);
  
    const togglePlay = () => {
      if (audioContextState === 'running') {
        audioContext.suspend();
      } else if (audioContextState === 'suspended') {
        audioContext.resume();
      }
    };
    
    React.useEffect(() => {
      const callback = () => {
        setAudioContextState(audioContext.state);
      };
  
      audioContext.addEventListener('statechange', callback);
  
      return () => {
        audioContext.removeEventListener('statechange', callback);
      }
    }, [audioContext]);
  
    return <div>
      <div>Current state: {audioContextState}</div>
        <button onClick={togglePlay}>
        {audioContextState === 'running' ? 'Stop' : 'Play'}
      </button>
      </div>
  }