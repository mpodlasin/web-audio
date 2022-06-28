import { Plug } from "../component-graph-canvas";


export interface AudioPlug extends Plug {
  audioParameter?: AudioNode | AudioParam;
  value?: number;
}

export interface AudioPlugWithAudioParameter extends Plug {
  audioParameter: AudioNode | AudioParam;
  value?: number;
}
  
export const connectPlugs = (a: AudioPlug, b: AudioPlug) => {
    const firstAudioParameter = a.audioParameter;
    const secondAudioParameter = b.audioParameter;
  
    if (firstAudioParameter instanceof AudioNode && secondAudioParameter instanceof AudioNode) {
      firstAudioParameter.connect(secondAudioParameter);
  
      return () => {
        firstAudioParameter.disconnect(secondAudioParameter);
      }
    }
  
    if (firstAudioParameter instanceof AudioNode && secondAudioParameter instanceof AudioParam) {
      firstAudioParameter.connect(secondAudioParameter);
  
      return () => {
        firstAudioParameter.disconnect(secondAudioParameter);
      }
    }

    if (firstAudioParameter === undefined || secondAudioParameter === undefined) {
      return () => {};
    }
  
    throw new Error();
  };