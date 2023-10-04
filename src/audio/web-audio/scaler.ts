export class Scaler extends AudioWorkletProcessor {
	constructor() {
		super();
	}

	static get parameterDescriptors() {
		return [
			{
				name: 'a-from',
				defaultValue: -1,
				minValue: Number.MIN_SAFE_INTEGER,
				maxValue: Number.MAX_SAFE_INTEGER
			},
			{
				name: 'a-to',
				defaultValue: 0,
				minValue: Number.MIN_SAFE_INTEGER,
				maxValue: Number.MAX_SAFE_INTEGER
			},
			{
				name: 'b-from',
				defaultValue: 1,
				minValue: Number.MIN_SAFE_INTEGER,
				maxValue: Number.MAX_SAFE_INTEGER
			},
			{
				name: 'b-to',
				defaultValue: 1,
				minValue: Number.MIN_SAFE_INTEGER,
				maxValue: Number.MAX_SAFE_INTEGER
			}
		];
	}

	process(
		inputList: Float32Array[][],
		outputList: Float32Array[][],
		parameters: Record<string, Float32Array>
	) {
		const aFrom = parameters['a-from'];
		const aTo = parameters['a-to'];

		const bFrom = parameters['b-from'];
		const bTo = parameters['b-to'];

		if (!aFrom || !aTo || !bFrom || !bTo) {
			return true;
		}

		const aFromValue = aFrom[0] ?? 0;
		const bFromValue = bFrom[0] ?? 0;
		const aToValue = aTo[0] ?? 0;
		const bToValue = bTo[0] ?? 0;

		inputList.forEach((input, firstIndex) => {
			input.forEach((inp, secondIndex) => {
				for (let i = 0; i < inp.length; i++) {
					const output = outputList[firstIndex];

					if (output) {
						const out = output[secondIndex];

						if (out) {
							const value = inp[i] ?? 0;

							const result =
								((value - aFromValue) / (bFromValue - aFromValue)) * (bToValue - aToValue) +
								aToValue;

							out[i] = result;
						}
					}
				}
			});
		});

		return true;
	}
}

registerProcessor('scaler', Scaler);

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
declare const currentFrame: number;
declare const sampleRate: number;
