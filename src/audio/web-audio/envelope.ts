type Event = { start: number; end: number };

const lengthInSamples = (event: Event) => Math.round(event.end - event.start);

export class Envelope extends AudioWorkletProcessor {
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
			}
		];
	}

	lastValueOfPreviousProcess = 0;

	attack: Event | null = null;
	release: Event | null = null;

	process(
		inputList: Float32Array[][],
		outputList: Float32Array[][],
		parameters: Record<string, Float32Array>,
		_currentFrame: number = currentFrame
	) {
		this.copyInputsToOutputs(inputList, outputList);
		this.detectAttack(inputList, parameters, _currentFrame);
		this.detectRelease(inputList, parameters, _currentFrame);
		this.saveLastValueOfPreviousProcess(inputList);

		if (this.attack) {
			this.handleAttack(this.attack, _currentFrame, outputList);
		}

		if (this.release) {
			this.handleRelease(this.release, _currentFrame, outputList);
		}

		return true;
	}

	handleAttack(attack: Event, _currentFrame: number, outputList: Float32Array[][]) {
		const attackLengthInSamples = lengthInSamples(attack);
		const { start, end } = attack;

		outputList.forEach((output) => {
			output.forEach((out) => {
				for (let i = 0; i < out.length; i++) {
					const sampleIndex = _currentFrame + i;
					if (start <= sampleIndex && sampleIndex < end && attackLengthInSamples !== 0) {
						const formula = (sampleIndex - start) / attackLengthInSamples;

						out[i] = Math.max(0, Math.min(formula, 1));
					}
				}
			});
		});
	}

	handleRelease(release: Event, _currentFrame: number, outputList: Float32Array[][]) {
		const releaseLengthInSamples = lengthInSamples(release);
		const { start, end } = release;

		outputList.forEach((output) => {
			output.forEach((out) => {
				for (let i = 0; i < out.length; i++) {
					const sampleIndex = _currentFrame + i;

					if (start <= sampleIndex && sampleIndex < end && releaseLengthInSamples !== 0) {
						const formula = (end - sampleIndex) / releaseLengthInSamples;

						out[i] = Math.max(0, Math.min(formula, 1));
					}
				}
			});
		});
	}

	saveLastValueOfPreviousProcess(inputList: Float32Array[][]) {
		inputList.forEach((input) => {
			input.forEach((inp) => {
				this.lastValueOfPreviousProcess = inp[inp.length - 1] ?? 0;
			});
		});
	}

	detectAttack(
		inputList: Float32Array[][],
		parameters: Record<string, Float32Array>,
		_currentFrame: number
	): void {
		let attackIndex: number | null = null;

		inputList.forEach((input) => {
			input.forEach((inp) => {
				if (this.lastValueOfPreviousProcess === 0 && inp[0] === 1) {
					attackIndex = 0;
				} else {
					for (let i = 0; i < inp.length - 1; i++) {
						if (inp[i] === 0 && inp[i + 1] === 1) {
							attackIndex = i + 1;
						}
					}
				}
			});
		});

		const attack = parameters.attack;

		if (attackIndex !== null && attack && attack.length > 0) {
			const numberOfSamplesPerSecond = this._sampleRate;
			const attackInMilliseconds = attack[0] ?? 0;
			const attackInSeconds = attackInMilliseconds / 1000;
			const attackInSamples = Math.round(attackInSeconds * numberOfSamplesPerSecond);

			this.attack = {
				start: _currentFrame + attackIndex,
				end: _currentFrame + attackIndex + attackInSamples
			};
		}
	}

	detectRelease(
		inputList: Float32Array[][],
		parameters: Record<string, Float32Array>,
		_currentFrame: number
	): void {
		let releaseIndex: number | null = null;

		inputList.forEach((input) => {
			input.forEach((inp) => {
				if (this.lastValueOfPreviousProcess === 1 && inp[0] === 0) {
					releaseIndex = 0;
				} else {
					for (let i = 0; i < inp.length - 1; i++) {
						if (inp[i] === 1 && inp[i + 1] === 0) {
							releaseIndex = i + 1;
						}
					}
				}
			});
		});

		const release = parameters.release;

		if (releaseIndex !== null && release && release.length > 0) {
			const numberOfSamplesPerSecond = this._sampleRate;
			const releaseInMilliseconds = release[0] ?? 0;
			const releaseInSeconds = releaseInMilliseconds / 1000;
			const releaseInSamples = Math.round(releaseInSeconds * numberOfSamplesPerSecond);

			this.release = {
				start: _currentFrame + releaseIndex,
				end: _currentFrame + releaseIndex + releaseInSamples
			};
		}
	}

	copyInputsToOutputs(inputList: Float32Array[][], outputList: Float32Array[][]) {
		outputList.forEach((output, firstIndex) => {
			output.forEach((out, secondIndex) => {
				for (let i = 0; i < out.length; i++) {
					out[i] = inputList[firstIndex]?.[secondIndex]?.[i] ?? 0;
				}
			});
		});
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

declare const registerProcessor: (name: string, value: object) => void;
declare const currentFrame: number;
declare const sampleRate: number;
