import React from 'react';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

const READABLE_AUDIO_CONTEXT_STATE: {[P in AudioContextState]: string} = {
  'suspended': 'Suspended',
  'closed': 'Closed',
  'running': 'Running',
};

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

    React.useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if (e.key === ' ') {
          togglePlay();
        }
      };

      window.addEventListener('keypress', handler);

      return () => window.removeEventListener('keypress', handler);
    });
  
    return <div>
      <div>{READABLE_AUDIO_CONTEXT_STATE[audioContextState]}</div>
        <button onClick={togglePlay}>
        {audioContextState === 'running' ? 'Stop' : 'Play'}
      </button>
      </div>
  }