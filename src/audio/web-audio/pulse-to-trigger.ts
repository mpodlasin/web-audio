export class PulseToTrigger extends AudioWorkletProcessor {
	constructor(
		options: AudioWorkletNodeOptions | undefined,
		private _sampleRate: number = sampleRate
	) {
		super(options);
	}

	process(
		inputs: Float32Array[][],
		outputs: Float32Array[][],
		parameters: Record<string, Float32Array>,
		_currentFrame = currentFrame
	) {
		inputs.forEach((input, firstIndex) => {
			input.forEach((inp, secondIndex) => {
				for (let i = 0; i < inp.length; i++) {
					const output = outputs[firstIndex];

					if (output) {
						const out = output[secondIndex];

						if (!out) return;

						if ((inp[i] ?? 0) < 0) {
							out[i] = 0;
						} else {
							out[i] = 1;
						}
					}
				}
			});
		});

		return true;
	}
}

registerProcessor('pulse-to-trigger', PulseToTrigger);

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
