import React from 'react';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

export const OutputDefinition: AudioComponentDefinition<AudioDestinationNode, void> = {
  component: Output,
  initializeMutableState: ({ globalAudioContext }) => globalAudioContext.destination,
  initialSerializableState: undefined,
  inPlugs: {
    'Input': {
      type: 'audio',
      getParameter: audioDestinationNode => audioDestinationNode,
    }
  },
  outPlugs: {},
  color: 'lightseagreen',
};

export type OutputProps = AudioComponentProps<AudioDestinationNode, void>;

export function Output({ applicationContext }: OutputProps) {
    const [audioContextState, setAudioContextState] = React.useState(applicationContext.globalAudioContext.state);
  
    const togglePlay = () => {
      if (audioContextState === 'running') {
        applicationContext.globalAudioContext.suspend();
      } else if (audioContextState === 'suspended') {
        applicationContext.globalAudioContext.resume();
      }
    };
    
    React.useEffect(() => {
      const callback = () => {
        setAudioContextState(applicationContext.globalAudioContext.state);
      };
  
      applicationContext.globalAudioContext.addEventListener('statechange', callback);
  
      return () => {
        applicationContext.globalAudioContext.removeEventListener('statechange', callback);
      }
    }, []);
  
    return <div>
      <div>Current state: {audioContextState}</div>
        <button onClick={togglePlay}>
        {audioContextState === 'running' ? 'Stop' : 'Play'}
      </button>
      </div>
  }