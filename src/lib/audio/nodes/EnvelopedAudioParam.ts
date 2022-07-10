export interface EnvelopedAudioParamOptions {
    attack: number;
}

export class EnvelopedAudioParam {
    public baseAudioParameter: AudioParam | undefined;

    constructor(private options: EnvelopedAudioParamOptions) {
    }

    setValueAtTime(value: number, startTime: number): EnvelopedAudioParam {
        if (this.baseAudioParameter === undefined) {
            return this;
        }

        this.baseAudioParameter.setValueAtTime(0, startTime);

        this.baseAudioParameter.linearRampToValueAtTime(
            value, 
            startTime + (this.options.attack / 1000)
        );

        return this;
    }
}
