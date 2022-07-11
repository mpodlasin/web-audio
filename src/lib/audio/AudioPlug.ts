import { Plug } from "../component-graph-canvas";
import { Subject } from 'rxjs';


export interface AudioPlug extends Plug {
  type: 'audio',
  value?: AudioNode;
}

export interface PingPlug extends Plug {
  type: 'ping',
  value?: Subject<void>,
}

export interface NumberPlug extends Plug {
  type: 'number',
  value?: number | AudioParam;
}

export type PlugWithValue = AudioPlug | PingPlug | NumberPlug;

export const connectPlugsWithValues = (a: PlugWithValue, b: PlugWithValue) => {
  if (a.type === 'audio' && b.type === 'audio' && a.value && b.value) {
    return connectAudioNodeToAudioNode(a.value, b.value);
  }

  if (a.type === 'audio' && b.type === 'number' && a.value && b.value && b.value instanceof AudioParam) {
    return connectAudioNodeToAudioParam(a.value, b.value);
  }

  if (a.type === 'ping' && b.type === 'ping' && a.value && b.value) {
    return connectSubjectToSubject(a.value, b.value);
  }

  if (a.type === 'ping' && b.type === 'ping') {
    return () => {};
  }

  if (a.type === 'number' && b.type === 'number') {
    return () => {};
  }

  throw new Error();
};

const connectAudioNodeToAudioNode = (a: AudioNode, b: AudioNode) => {
  a.connect(b);
  
  return () => a.disconnect(b);
};

const connectAudioNodeToAudioParam = (a: AudioNode, b: AudioParam) => {
  a.connect(b);
  
  return () => a.disconnect(b);
}

const connectSubjectToSubject = (a: Subject<void>, b: Subject<void>) => {
  const subscription = a.subscribe(b);

  return () => subscription.unsubscribe();
}
