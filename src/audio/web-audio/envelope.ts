class Envelope extends AudioWorkletProcessor {
	constructor() {
		super();
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
			}
		];
	}

	lastValueOfPreviousProcess = 0;
	finishEnvelopeAt: number | null = null;
	envelopeStartedAt: number | null = null;

	process(
		inputList: Float32Array[][],
		outputList: Float32Array[][],
		parameters: Record<string, Float32Array>
	) {
		let triggerEnvelope = false;

		inputList.forEach((input) => {
			input.forEach((inp) => {
				if (this.lastValueOfPreviousProcess === 0 && inp[0] === 1) {
					triggerEnvelope = true;
				} else {
					for (let i = 0; i < inp.length - 1; i++) {
						if (inp[i] === 0 && inp[i + 1] === 1) {
							triggerEnvelope = true;
						}
					}
				}
			});
		});

		if (triggerEnvelope) {
			this.envelopeStartedAt = currentTime;
		}

		let triggerRelease = false;

		inputList.forEach((input) => {
			input.forEach((inp) => {
				if (this.lastValueOfPreviousProcess === 1 && inp[0] === 0) {
					triggerRelease = true;
				} else {
					for (let i = 0; i < inp.length - 1; i++) {
						if (inp[i] === 1 && inp[i + 1] === 0) {
							triggerRelease = true;
						}
					}
				}
			});
		});

		inputList.forEach((input) => {
			input.forEach((inp) => {
				this.lastValueOfPreviousProcess = inp[inp.length - 1] ?? 0;
			});
		});

		if (triggerRelease) {
			const release = parameters.release;

			if (release && release.length === 1) {
				const releaseInMilliseconds = release[0] ?? 0;
				const releaseInSeconds = releaseInMilliseconds / 1000;

				this.finishEnvelopeAt = currentTime + releaseInSeconds;
			}

			this.envelopeStartedAt = null;
		}

		if (this.envelopeStartedAt && this.envelopeStartedAt < currentTime) {
			const attack = parameters.attack;

			if (attack && attack.length === 1) {
				const attackInMilliseconds = attack[0] ?? 0;
				const attackInSeconds = attackInMilliseconds / 1000;

				outputList.forEach((output) => {
					output.forEach((out) => {
						if (!this.envelopeStartedAt) return;
						for (let i = 0; i < out.length - 1; i++) {
							out[i] = (currentTime - this.envelopeStartedAt) / attackInSeconds;
						}
					});
				});
			}
		}

		if (this.finishEnvelopeAt && currentTime < this.finishEnvelopeAt) {
			const release = parameters.release;

			if (release && release.length === 1) {
				const releaseInMilliseconds = release[0] ?? 0;
				const releaseInSeconds = releaseInMilliseconds / 1000;

				outputList.forEach((output) => {
					output.forEach((out) => {
						if (!this.finishEnvelopeAt) return;
						for (let i = 0; i < out.length - 1; i++) {
							out[i] = (this.finishEnvelopeAt - currentTime) / releaseInSeconds;
						}
					});
				});
			}
		} else {
			this.finishEnvelopeAt = null;
		}

		return true;
	}
}

registerProcessor('envelope', Envelope);

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

declare const registerProcessor: any;

declare const currentTime: number;
