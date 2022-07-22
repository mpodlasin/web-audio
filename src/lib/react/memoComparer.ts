import { AudioComponentProps } from "../audio/components/AudioComponentDefinition";

export function memoComparer<MutableState, SerializableState extends {[index: string]: any}>(
    prevProps: AudioComponentProps<MutableState, SerializableState>, 
    nextProps: AudioComponentProps<MutableState, SerializableState>, 
) {
    if (prevProps.serializableState === undefined && nextProps.serializableState === undefined) {
        return true;
    }

    if(Object.entries(prevProps.serializableState).some(
        ([key, entry]) => entry !== nextProps.serializableState[key]
      )) {
        return false;
      }
    
    if (Object.entries(prevProps.outPlugs.number).some(
        ([key, value]) => value.connected !== nextProps.outPlugs.number[key].connected
    )) {
        return false;
    }

    if (Object.entries(prevProps.outPlugs.ping).some(
        ([key, value]) => value.connected !== nextProps.outPlugs.ping[key].connected
    )) {
        return false;
    }
  
      return true;
}