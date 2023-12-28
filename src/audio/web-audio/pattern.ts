export class Pattern extends AudioWorkletProcessor {
	constructor(
		options: AudioWorkletNodeOptions | undefined,
		private _sampleRate: number = sampleRate
	) {
		super(options);
	}

	static get parameterDescriptors() {
		return [
			...[1, 2, 3, 4, 5, 6, 7, 8].map((step) => ({
				name: `step${step}`,
				defaultValue: 0,
				minValue: 0,
				maxValue: 1
			})),
			{
				name: 'steps',
				minValue: 1,
				maxValue: 8,
				defaultValue: 8
			}
		];
	}

	currentStep = -1;

	process(
		inputList: Float32Array[][],
		outputList: Float32Array[][],
		parameters: Record<string, Float32Array>,
		_currentFrame: number = currentFrame
	) {
		const triggerIndexes = this.detectTriggers(inputList);

		const steps = [
			parameters.step1?.[0] ?? 0,
			parameters.step2?.[0] ?? 0,
			parameters.step3?.[0] ?? 0,
			parameters.step4?.[0] ?? 0,
			parameters.step5?.[0] ?? 0,
			parameters.step6?.[0] ?? 0,
			parameters.step7?.[0] ?? 0,
			parameters.step8?.[0] ?? 0
		];

		const numberOfSteps = parameters.steps?.[0] ?? 8;

		outputList.forEach((output) => {
			output.forEach((out) => {
				for (let i = 0; i < out.length; i++) {
					if (triggerIndexes.some((triggerIndex) => triggerIndex === i)) {
						this.currentStep = (this.currentStep + 1) % numberOfSteps;

						const step = steps[this.currentStep];

						if (step === 1) {
							out[i] = 1;
						}
					}
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

registerProcessor('pattern', Pattern);

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
