import React from 'react';
import { GLOBAL_AUDIO_CONTEXT } from '../audioContext';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

export const OutputDefinition: AudioComponentDefinition<AudioDestinationNode, void> = {
  component: Output,
  initializeMutableState: () => GLOBAL_AUDIO_CONTEXT.destination,
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

export function Output(_: OutputProps) {
    const [audioContextState, setAudioContextState] = React.useState(GLOBAL_AUDIO_CONTEXT.state);
  
    const togglePlay = () => {
      if (audioContextState === 'running') {
        GLOBAL_AUDIO_CONTEXT.suspend();
      } else if (audioContextState === 'suspended') {
        GLOBAL_AUDIO_CONTEXT.resume();
      }
    };
    
    React.useEffect(() => {
      const callback = () => {
        setAudioContextState(GLOBAL_AUDIO_CONTEXT.state);
      };
  
      GLOBAL_AUDIO_CONTEXT.addEventListener('statechange', callback);
  
      return () => {
        GLOBAL_AUDIO_CONTEXT.removeEventListener('statechange', callback);
      }
    }, [GLOBAL_AUDIO_CONTEXT]);
  
    return <div>
      <div>Current state: {audioContextState}</div>
        <button onClick={togglePlay}>
        {audioContextState === 'running' ? 'Stop' : 'Play'}
      </button>
      </div>
  }