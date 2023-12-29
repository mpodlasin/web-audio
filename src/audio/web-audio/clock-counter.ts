export class ClockCounter extends AudioWorkletProcessor {
	constructor(
		options: AudioWorkletNodeOptions | undefined,
		private _sampleRate: number = sampleRate
	) {
		super(options);
	}

	static get parameterDescriptors() {
		return [
			{
				name: 'modulo',
				minValue: 0,
				maxValue: Number.MAX_SAFE_INTEGER,
				defaultValue: 1
			}
		];
	}

	count = 0;

	process(
		inputList: Float32Array[][],
		outputList: Float32Array[][],
		parameters: Record<string, Float32Array>,
		_currentFrame: number = currentFrame
	) {
		const triggerIndexes = this.detectTriggers(inputList);

		const modulo = parameters.modulo?.[0] ?? 1;

		outputList.forEach((output) => {
			output.forEach((out) => {
				for (let i = 0; i < out.length; i++) {
					if (triggerIndexes.some((triggerIndex) => triggerIndex === i)) {
						this.count = (this.count + 1) % modulo;
					}

					out[i] = this.count;
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

registerProcessor('clock-counter', ClockCounter);

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
