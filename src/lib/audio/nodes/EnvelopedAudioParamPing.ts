import { Ping } from "./Ping";

export interface EnvelopedAudioParamPingOptions {
    attack: number;
    release: number;
    minValue: number;
    maxValue: number;
}

export class EnvelopedAudioParamPing implements Ping {
    public baseAudioParameter: AudioParam | undefined;

    constructor(public options: EnvelopedAudioParamPingOptions) {
    }

    start(time: number) {
        if (this.baseAudioParameter === undefined) return;

        this.baseAudioParameter.setValueAtTime(this.options.minValue, time);

        this.baseAudioParameter.linearRampToValueAtTime(
            this.options.maxValue, 
            time + (this.options.attack / 1000)
        );
    }

    stop(time: number) {
        if (this.baseAudioParameter === undefined) return;

        this.baseAudioParameter.linearRampToValueAtTime(
            this.options.minValue,
            time + (this.options.release / 1000)
        );
    }
}
