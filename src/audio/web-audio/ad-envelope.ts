interface EnvelopeEvent {
    start: number;
    attack: number;
    decay: number;
}

export class ADEnvelope extends AudioWorkletProcessor {
	constructor(
		options: AudioWorkletNodeOptions | undefined,
		private _sampleRate: number = sampleRate
	) {
		super(options);
	}

	static get parameterDescriptors() {
		return [
			{
				name: 'attack',
				defaultValue: 0,
				minValue: 0,
				maxValue: 1000
			},
			{
				name: 'decay',
				defaultValue: 0,
				minValue: 0,
				maxValue: 1000
			},
			{
				name: 'running',
				defalueValue: 0,
				minValue: 0,
				maxValue: 1
			},
		];
	}

    envelopeEvent: EnvelopeEvent | null = null;

	process(
		inputs: Float32Array[][],
		outputs: Float32Array[][],
		parameters: Record<string, Float32Array>,
		_currentFrame = currentFrame
	) {
		const attackParameter = parameters.attack ?? [];
		const decayParameter = parameters.decay ?? [];

        const attack = attackParameter[0] ?? 0;
        const decay = decayParameter[0] ?? 0;

        const trigger = this.detectTrigger(inputs);

        if (trigger) {
            this.envelopeEvent = {
                start: _currentFrame + trigger,
                attack,
                decay,
            }

            console.log(this.envelopeEvent);
        }

        this.handleEnvelopeEvent(_currentFrame, outputs);

		return true;
	}

    millisecondsToSamples(ms: number) {
        return ms / 1000 * this._sampleRate;
    }

    handleEnvelopeEvent(currentFrame: number, outputs: Float32Array[][]) {
        const event = this.envelopeEvent;

        if (event) {
            const start = event.start;
            const middle = event.start + this.millisecondsToSamples(event.attack);
            const end = event.start + this.millisecondsToSamples(event.attack) + this.millisecondsToSamples(event.decay);

            outputs.forEach(output => {
                output.forEach(out => {
                    for (let i = 0; i < out.length; i++) {
                        const sampleIndex = currentFrame + i;

                        if (start <= sampleIndex && sampleIndex <= middle) {
                            out[i] = this.attackFn(sampleIndex - start, this.millisecondsToSamples(event.attack));
                        }

                        if (middle <= sampleIndex && sampleIndex <= end) {
                            out[i] = this.decayFn(sampleIndex - middle, this.millisecondsToSamples(event.decay));
                        }

                        if (sampleIndex > end) {
                            this.envelopeEvent = null;
                        }
                    }
                })
            })
        }
    }

    attackFn(x: number, attack: number) {
        return x / attack;
    }

    decayFn(x: number, decay: number) {
        const e = 7;

        return (e**(x / -decay) - 1 / e) * e / (e - 1);
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
}

registerProcessor('ad-envelope', ADEnvelope);

interface AudioWorkletProcessor {
	readonly port: MessagePort;
	process(
		inputs: Float32Array[][],
		outputs: Float32Array[][],
		parameters: Record<string, Float32Array>
	): boolean;
}

declare const AudioWorkletProcessor: {
	prototype: AudioWorkletProcessor;
	new (options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

declare const registerProcessor: (name: string, value: object) => void;
declare const currentFrame: number;
declare const sampleRate: number;
