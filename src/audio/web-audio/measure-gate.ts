export class MeasureGate extends AudioWorkletProcessor {
	constructor(
		options: AudioWorkletNodeOptions | undefined,
		private _sampleRate: number = sampleRate
	) {
		super(options);
	}

	previousToLastTriggerIndex = 0;
	lastTriggerIndex = 0;

	process(
		inputs: Float32Array[][],
		outputs: Float32Array[][],
		parameters: Record<string, Float32Array>,
		_currentFrame = currentFrame
	) {
		const triggerIndexes = this.detectTriggers(inputs);

		outputs.forEach((output) => {
			output.forEach((out) => {
				for (let i = 0; i < out.length; i++) {
					if (triggerIndexes.some((triggerIndex) => triggerIndex === i)) {
						this.previousToLastTriggerIndex = this.lastTriggerIndex;
						this.lastTriggerIndex = i + _currentFrame;
					}

					out[i] = (this.lastTriggerIndex - this.previousToLastTriggerIndex) / this._sampleRate;
				}
			});
		});

		return true;
	}

	lastValueOfPreviousProcess = 0;

	detectTriggers(inputList: Float32Array[][]): number[] {
		const triggerIndexes: number[] = [];

		inputList.forEach((input) => {
			input.forEach((inp) => {
				if (this.lastValueOfPreviousProcess === 0 && inp[0] === 1) {
					triggerIndexes.push(0);
				}

				for (let i = 0; i < inp.length - 1; i++) {
					if (inp[i] === 0 && inp[i + 1] === 1) {
						triggerIndexes.push(i + 1);
					}
				}
			});
		});

		return triggerIndexes;
	}
}

registerProcessor('measure-gate', MeasureGate);

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

declare const currentFrame: number;
declare const sampleRate: number;
