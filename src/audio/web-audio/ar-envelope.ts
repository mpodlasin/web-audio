export class AREnvelope extends AudioWorkletProcessor {
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
				name: 'release',
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
			{
				name: 'release-fall',
				defaultValue: 1,
				minValue: 0,
				maxValue: 1
			}
		];
	}

	process(
		inputs: Float32Array[][],
		outputs: Float32Array[][],
		parameters: Record<string, Float32Array>,
		_currentFrame = currentFrame
	) {
		const attackParameter = parameters.attack ?? [];
		const releaseParameter = parameters.release ?? [];

		const releaseFall = parameters['release-fall']?.[0] ?? 0;

		inputs.forEach((input, firstIndex) => {
			input.forEach((inp, secondIndex) => {
				for (let i = 0; i < inp.length; i++) {
					const output = outputs[firstIndex];

					if (output) {
						const out = output[secondIndex];

						if (out) {
							this.handleOut(
								inp,
								out,
								i,
								attackParameter[i] ?? attackParameter[0] ?? 0,
								releaseParameter[i] ?? releaseParameter[0] ?? 0,
								releaseFall
							);
						}
					}
				}
			});
		});

		return true;
	}

	lastOutputValue = 0;

	handleOut(
		inp: Float32Array,
		out: Float32Array,
		i: number,
		attack: number,
		release: number,
		releaseFall: number
	) {
		const wantedValue = inp[i] ?? 0;

		const attackInSamples = Math.round((attack / 1000) * this._sampleRate);
		const releaseInSamples = Math.round((release / 1000) * this._sampleRate);

		const lastOutputValue = this.lastOutputValue;

		let output = wantedValue;
		if (attackInSamples && wantedValue > lastOutputValue) {
			const calculatedValue = lastOutputValue + 1 / attackInSamples;

			if (calculatedValue < wantedValue) {
				output = calculatedValue;
			}
		}

		if (releaseInSamples && wantedValue < lastOutputValue) {
			const diff = lastOutputValue - wantedValue;
			const poweredDiff = Math.pow(diff, releaseFall);
			const calculatedValue = lastOutputValue - poweredDiff / releaseInSamples;

			if (wantedValue < calculatedValue) {
				output = calculatedValue;
			}
		}

		this.lastOutputValue = output;
		out[i] = output;
	}
}

registerProcessor('ar-envelope', AREnvelope);

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
