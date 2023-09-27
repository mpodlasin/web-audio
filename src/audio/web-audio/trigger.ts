export class Trigger extends AudioWorkletProcessor {
	constructor() {
		super();
	}

	static get parameterDescriptors() {
		return [
			{
				name: 'tempoInBPM',
				defaultValue: 120,
				minValue: 0,
				maxValue: 1000
			},
			{
				name: 'running',
				defalueValue: 0,
				minValue: 0,
				maxValue: 1
			}
		];
	}

	process(
		inputList: Float32Array[][],
		outputList: Float32Array[][],
		parameters: Record<string, Float32Array>
	) {
		const tempoInBPM = parameters.tempoInBPM;
		const running = parameters.running;

		if (!tempoInBPM) return true;

		if (!running || running[0] === 0) return true;

		if (tempoInBPM.length === 1) {
			outputList.forEach((output) => {
				output.forEach((out) => {
					const tempoArray = out.map(() => tempoInBPM[0] ?? 0);

					this.createOutputs(out, tempoArray);
				});
			});
		} else {
			outputList.forEach((output) => {
				output.forEach((out) => {
					this.createOutputs(out, tempoInBPM);
				});
			});
		}

		return true;
	}

	lastCycleEnd = 0;
	lastOutput = -1;

	private createOutputs(out: Float32Array, tempoInBPM: Float32Array) {
		for (let i = 0; i < out.length; i++) {
			const tempoPerSecond = (tempoInBPM[i] ?? 0) / 60;
			const durationInSeconds = 1 / tempoPerSecond;
			const cycleStart = (currentTime - this.lastCycleEnd) % durationInSeconds;
			const sampleLengthInSeconds = 1 / sampleRate;

			const now = cycleStart + i * sampleLengthInSeconds;

			if (now <= durationInSeconds / 2) {
				out[i] = 1;
				if (this.lastOutput === 0) {
					this.lastCycleEnd = currentTime;
				}

				this.lastOutput = 1;
			} else {
				out[i] = 0;
				this.lastOutput = 0;
			}
		}
	}
}

registerProcessor('trigger', Trigger);

interface AudioWorkletProcessor {
	readonly port: MessagePort;
	process(
		inputs: Float32Array[][],
		outputs: Float32Array[][],
		parameters: Record<string, Float32Array>
	): void;
}

declare const AudioWorkletProcessor: {
	prototype: AudioWorkletProcessor;
	new (options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

declare const registerProcessor: (name: string, value: object) => void;

declare const currentTime: number;
declare const sampleRate: number;
