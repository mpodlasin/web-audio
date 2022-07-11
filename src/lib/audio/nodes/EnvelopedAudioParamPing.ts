import { Ping } from "./Ping";

export interface EnvelopedAudioParamPingOptions {
    attack: number;
    release: number;
}

export class EnvelopedAudioParamPing implements Ping {
    public baseAudioParameter: AudioParam | undefined;

    constructor(public options: EnvelopedAudioParamPingOptions) {
    }

    start(time: number) {
        if (this.baseAudioParameter === undefined) return;

        this.baseAudioParameter.setValueAtTime(0, time);

        this.baseAudioParameter.linearRampToValueAtTime(
            1, 
            time + (this.options.attack / 1000)
        );
    }

    stop(time: number) {
        if (this.baseAudioParameter === undefined) return;

        this.baseAudioParameter.linearRampToValueAtTime(
            0,
            time + (this.options.release / 1000)
        );
    }
}
