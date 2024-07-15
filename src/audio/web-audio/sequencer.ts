export class Sequencer extends AudioWorkletProcessor {
	constructor() {
		super();
	}

	static get parameterDescriptors() {
		const createFrequencyDescriptor = (name: string) => ({
			name,
			defaultValue: 440,
			minValue: 0,
			maxValue: 20000
		});

		return [1, 2, 3, 4, 5, 6, 7, 8].map((i) => `frequency${i}`).map(createFrequencyDescriptor);
	}

	currentStep = -1;
	lastInputFromPreviousProcess = 0;

	process(
		inputList: Float32Array[][],
		outputList: Float32Array[][],
		parameters: Record<string, Float32Array>
	) {
		inputList.forEach((input) => {
			input.forEach((inp) => {
				for (let i = 0; i < inp.length - 1; i++) {
					if (inp[i] === 0 && inp[i + 1] === 1) {
						this.currentStep = (this.currentStep + 1) % 8;
					}
				}

				if (this.lastInputFromPreviousProcess === 0 && inp[0] === 1) {
					this.currentStep = (this.currentStep + 1) % 8;
				}

				this.lastInputFromPreviousProcess = inp.at(-1) ?? 0;
			});
		});

		const currentFrequency = parameters[`frequency${this.currentStep + 1}`];

		if (currentFrequency) {
			const value = currentFrequency[0] ?? 0;

			outputList.forEach((output) => {
				output.forEach((out) => {
					for (let i = 0; i < out.length; i++) {
						out[i] = value;
					}
				});
			});
		}

		return true;
	}
}

registerProcessor('sequencer', Sequencer);

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
