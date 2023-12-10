export class GateLength extends AudioWorkletProcessor {
	constructor(
		options: AudioWorkletNodeOptions | undefined,
		private _sampleRate: number = sampleRate
	) {
		super(options);
	}

	static get parameterDescriptors() {
		return [
			{
				name: 'length',
				defaultValue: 1/10,
				minValue: 0,
				maxValue: 60
			},
			{
				name: 'running',
				defalueValue: 0,
				minValue: 0,
				maxValue: 1
			}
		];
	}

    triggerEvent: { start: number, end: number } | null = null;

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>, _currentFrame = currentFrame) {
        const triggerIndex = this.detectTrigger(inputs);

        this.saveLastValueOfPreviousProcess(inputs);

        if (triggerIndex !== null) {
            const length = parameters.length;

            if (!length) return true;

            const lengthInSeconds = length[0] ?? 0;
            const lengthInSamples = Math.round(lengthInSeconds * this._sampleRate);

            this.triggerEvent = {
                start: _currentFrame + triggerIndex,
                end: _currentFrame + lengthInSamples,
            }
        }

        if (this.triggerEvent) {
            const { start, end } = this.triggerEvent;
            outputs.forEach(output => {
                output.forEach(out => {
                    for (let i = 0; i < out.length; i++) {
                        const sampleIndex = _currentFrame + i;

                        if (start <= sampleIndex && sampleIndex < end) {
                            out[i] = 1;
                        } else {
                            out[i] = 0;
                        }
                    }
                })
            })
        }

        return true;
    }

    lastValueOfPreviousProcess = 0;

    detectTrigger(inputList: Float32Array[][]): number | null {
		let triggerIndex: number | null = null;

		inputList.forEach((input) => {
			input.forEach((inp) => {
				if (this.lastValueOfPreviousProcess === 0 && inp[0] === 1) {
					triggerIndex = 0;
				} else {
					for (let i = 0; i < inp.length - 1; i++) {
						if (inp[i] === 0 && inp[i + 1] === 1) {
							triggerIndex = i + 1;
						}
					}
				}
			});
		});

        return triggerIndex;
    }

    saveLastValueOfPreviousProcess(inputList: Float32Array[][]) {
		inputList.forEach((input) => {
			input.forEach((inp) => {
				this.lastValueOfPreviousProcess = inp[inp.length - 1] ?? 0;
			});
		});
	}
}

registerProcessor('gate-length', GateLength);

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
