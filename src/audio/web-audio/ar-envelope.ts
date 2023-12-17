type Event = { start: number; end: number; type: 'attack' | 'release' };

const lengthInSamples = (event: Event) => Math.round(event.end - event.start);

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
			}
		];
	}

	lastValueOfPreviousProcess: number | null = null;

	events: Event[] = [];
	get attacks() {
		return this.events.filter((event) => event.type === 'attack');
	}
	get releases() {
		return this.events.filter((event) => event.type === 'release');
	}

	process(
		inputList: Float32Array[][],
		outputList: Float32Array[][],
		parameters: Record<string, Float32Array>,
		_currentFrame: number = currentFrame
	) {
		this.copyInputsToOutputs(inputList, outputList);
		this.detectAttacks(inputList, parameters, _currentFrame);
		this.detectReleases(inputList, parameters, _currentFrame);
		this.saveLastValueOfPreviousProcess(inputList);

		for (const event of this.events) {
			if (event.type === 'attack') {
				this.handleAttack(event, _currentFrame, outputList);
			} else {
				this.handleRelease(event, _currentFrame, outputList);
			}
		}

		return true;
	}

	attackFormula(sampleIndex: number, attack: Event) {
		return (sampleIndex - attack.start) / lengthInSamples(attack);
	}

	releaseFormula(sampleIndex: number, release: Event) {
		return (release.end - sampleIndex) / lengthInSamples(release);
	}

	handleAttack(attack: Event, _currentFrame: number, outputList: Float32Array[][]) {
		const attackLengthInSamples = lengthInSamples(attack);
		const { start, end } = attack;
		const valueAtAttackStart = this.calculateValueAtStartOfAttack(start);

		outputList.forEach((output) => {
			output.forEach((out) => {
				for (let i = 0; i < out.length; i++) {
					const sampleIndex = _currentFrame + i;
					if (start <= sampleIndex && sampleIndex < end && attackLengthInSamples !== 0) {
						const formula = this.attackFormula(sampleIndex, attack) + valueAtAttackStart;

						out[i] = Math.max(0, Math.min(formula, 1));
					}
				}
			});
		});
	}

	handleRelease(release: Event, _currentFrame: number, outputList: Float32Array[][]) {
		const releaseLengthInSamples = lengthInSamples(release);
		const { start, end } = release;
		const valueAtReleaseStart = this.calculateValueAtStartOfRelease(start);

		outputList.forEach((output) => {
			output.forEach((out) => {
				for (let i = 0; i < out.length; i++) {
					const sampleIndex = _currentFrame + i;

					if (start <= sampleIndex && sampleIndex < end && releaseLengthInSamples !== 0) {
						const formula = this.releaseFormula(sampleIndex, release) * valueAtReleaseStart;

						out[i] = Math.max(0, Math.min(formula, 1));
					}
				}
			});
		});
	}

	calculateValueAtStartOfAttack(attackStart: number) {
		const release = this.releases.find(
			(release) => release.start < attackStart && attackStart < release.end
		);

		if (release) {
			return this.releaseFormula(attackStart, release);
		} else {
			return 0;
		}
	}

	calculateValueAtStartOfRelease(releaseStart: number) {
		const attack = this.attacks.find(
			(attack) => attack.start < releaseStart && releaseStart < attack.end
		);

		if (attack) {
			return this.attackFormula(releaseStart, attack);
		} else {
			return 1;
		}
	}

	saveLastValueOfPreviousProcess(inputList: Float32Array[][]) {
		inputList.forEach((input) => {
			input.forEach((inp) => {
				this.lastValueOfPreviousProcess = inp[inp.length - 1] ?? 0;
			});
		});
	}

	detectAttacks(
		inputList: Float32Array[][],
		parameters: Record<string, Float32Array>,
		_currentFrame: number
	): void {
		const attackIndexes: number[] = [];

		inputList.forEach((input) => {
			input.forEach((inp) => {
				if (this.lastValueOfPreviousProcess === 0 && inp[0] === 1) {
					attackIndexes.push(0);
				} else {
					for (let i = 0; i < inp.length - 1; i++) {
						if (inp[i] === 0 && inp[i + 1] === 1) {
							attackIndexes.push(i + 1);
						}
					}
				}
			});
		});

		const attack = parameters.attack;

		if (attack && attack.length > 0) {
			const numberOfSamplesPerSecond = this._sampleRate;
			const attackInMilliseconds = attack[0] ?? 0;
			const attackInSeconds = attackInMilliseconds / 1000;
			const attackInSamples = Math.round(attackInSeconds * numberOfSamplesPerSecond);

			for (const attackIndex of attackIndexes) {
				this.events.push({
					type: 'attack',
					start: _currentFrame + attackIndex,
					end: _currentFrame + attackIndex + attackInSamples
				});
			}
		}
	}

	detectReleases(
		inputList: Float32Array[][],
		parameters: Record<string, Float32Array>,
		_currentFrame: number
	): void {
		const releaseIndexes: number[] = [];

		inputList.forEach((input) => {
			input.forEach((inp) => {
				if (this.lastValueOfPreviousProcess === 1 && inp[0] === 0) {
					releaseIndexes.push(0);
				} else {
					for (let i = 0; i < inp.length - 1; i++) {
						if (inp[i] === 1 && inp[i + 1] === 0) {
							releaseIndexes.push(i + 1);
						}
					}
				}
			});
		});

		const release = parameters.release;

		if (release && release.length > 0) {
			const numberOfSamplesPerSecond = this._sampleRate;
			const releaseInMilliseconds = release[0] ?? 0;
			const releaseInSeconds = releaseInMilliseconds / 1000;
			const releaseInSamples = Math.round(releaseInSeconds * numberOfSamplesPerSecond);

			for (const releaseIndex of releaseIndexes) {
				this.events.push({
					type: 'release',
					start: _currentFrame + releaseIndex,
					end: _currentFrame + releaseIndex + releaseInSamples
				});
			}
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

registerProcessor('ar-envelope', AREnvelope);

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
