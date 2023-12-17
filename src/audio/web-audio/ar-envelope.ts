type Event = { start: number; end: number; type: 'attack' | 'release' };

const eventEqual = (a: Event, b: Event) => {
	return a.start === b.start && a.end === b.end && a.type === b.type;
}

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
	get sortedEvents() {
		return [
			...this.events,
		].sort((a, b) => {
			return a.start - b.start;
		});
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

		this.createOutputs(outputList, _currentFrame);

		return true;
	}

	createOutputs(outputList: Float32Array[][], _currentFrame: number) {
		outputList.forEach(output => {
			output.forEach(out => {
				for (let i = 0; i < out.length; i++) {
					const sampleIndex = _currentFrame + i;

					const events = this.events.filter(event => event.start <= sampleIndex && sampleIndex <= event.end);

					if (events.length === 1) {
						for (const event of events) {
							const eventLength = lengthInSamples(event);
							if (eventLength > 0) {
								if (event.type === 'attack') {
									out[i] = this.attackFormula(sampleIndex, event);
									continue;
								} else {
									out[i] = this.releaseFormula(sampleIndex, event);
									continue;
								}
							}
						}
					} else {
						const attacks = events.filter(event => event.type === 'attack');
						const releases = events.filter(event => event.type === 'release');

						const attack = attacks.at(-1);
						const release = releases.at(-1);

						if (attack && release) {
							if (attack.start < release.start) {
								out[i] = this.releaseFormula(sampleIndex, release) * this.attackFormula(release.start, attack);
								continue;
							}

							if (release.start < attack.end) {

								this.events = this.events.filter(event => !eventEqual(event, release));
								continue;
							}
						}
					}
				}
			});
		})
	}

	attackFormula(sampleIndex: number, attack: Event) {
		return (sampleIndex - attack.start) / lengthInSamples(attack);
	}

	releaseFormula(sampleIndex: number, release: Event) {
		return (release.end - sampleIndex) / lengthInSamples(release);
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
