import { Observable } from "rxjs";
import { Plug } from "../component-graph-canvas";


export interface AudioPlug extends Plug {
    audioParameter: AudioNode | AudioParam |  Observable<number>;
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
  
    if (firstAudioParameter instanceof Observable && secondAudioParameter instanceof AudioParam) {
      const subscription = firstAudioParameter.subscribe(value => {
        secondAudioParameter.value = value;
      });
  
      return () => {
        subscription.unsubscribe();
      }
    }
  
    throw new Error();
  };