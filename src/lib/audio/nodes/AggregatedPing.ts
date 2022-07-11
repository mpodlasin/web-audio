import { Ping } from "./Ping";

export class AggregatedPing implements Ping {
    public baseAudioParameter: AudioParam | undefined;

    constructor(public pings: Ping[]) {
    }

    start(time: number) {
        this.pings.forEach(ping => ping.start(time));
    }

    stop(time: number) {
        this.pings.forEach(ping => ping.stop(time));
    }
}
