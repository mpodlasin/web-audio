import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';
import { impulseResponse } from '../impulseResponse';
import React from 'react';

export const ReverbDefinition: AudioComponentDefinition<ConvolverNode, void> = {
  component: Reverb,
  initializeMutableState: ({ globalAudioContext }) => new ConvolverNode(globalAudioContext),
  initialSerializableState: undefined,
  inPlugs: {
    'Input': {
      type: 'audio',
      getParameter: filterNode => filterNode,
    },
  },
  outPlugs: {
    'Output': {
      type: 'audio',
      getParameter: filterNode => filterNode,
    }
  },
  color: 'lightpink',
};

export type ReverbProps = AudioComponentProps<ConvolverNode, void>;

function base64ToArrayBuffer(base64: string) {
    var binaryString = window.atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++)        {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export function Reverb({ mutableState: reverbNode, applicationContext }: ReverbProps) {
    React.useEffect(() => {
        applicationContext.globalAudioContext.decodeAudioData(base64ToArrayBuffer(impulseResponse))
            .then(buffer => {
                reverbNode.buffer = buffer;
            });

    }, [reverbNode]);

    return null;
}

