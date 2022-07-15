export class AggregatedAudioParam implements AudioParam {
    constructor(private audioParams: AudioParam[]) {}

    automationRate: AutomationRate = 'a-rate';
    readonly defaultValue: number = 0;
    readonly maxValue: number = 0;
    readonly minValue: number = 0;
    value: number = 0;
    cancelAndHoldAtTime(cancelTime: number): AudioParam {
        this.audioParams.forEach(audioParam => audioParam.cancelAndHoldAtTime(cancelTime));

        return this;
    }
    cancelScheduledValues(cancelTime: number): AudioParam {
        this.audioParams.forEach(audioParam => audioParam.cancelScheduledValues(cancelTime));

        return this;
    }
    exponentialRampToValueAtTime(value: number, endTime: number): AudioParam {
        this.audioParams.forEach(audioParam => audioParam.exponentialRampToValueAtTime(value, endTime));

        return this;
    }
    linearRampToValueAtTime(value: number, endTime: number): AudioParam {
        this.audioParams.forEach(audioParam => audioParam.linearRampToValueAtTime(value, endTime));

        return this;
    }
    setTargetAtTime(target: number, startTime: number, timeConstant: number): AudioParam {
        this.audioParams.forEach(audioParam => audioParam.setTargetAtTime(target, startTime, timeConstant));

        return this;
    }
    setValueAtTime(value: number, startTime: number): AudioParam {
        this.audioParams.forEach(audioParam => audioParam.setValueAtTime(value, startTime));

        return this;
    }
    setValueCurveAtTime(values: number[] | Float32Array, startTime: number, duration: number): AudioParam {
        this.audioParams.forEach(audioParam => audioParam.setValueCurveAtTime(values, startTime, duration));

        return this;
    }
}