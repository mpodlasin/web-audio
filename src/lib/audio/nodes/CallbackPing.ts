import { Ping } from "./Ping";

export class CallbackPing implements Ping {
    public onStart: (time: number) => void = () => {};
    public onStop: (time: number) => void = () => {};

    start(time: number): void {
        this.onStart(time);
    }

    stop(time: number): void {
        this.onStop(time);
    }
}