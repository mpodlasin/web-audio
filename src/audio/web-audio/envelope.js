class Envelope extends AudioWorkletProcessor {
	constructor() {
		super();
	}

	static get parameterDescriptors() {
		return [
			{
				name: 'trigger',
				minValue: 0,
				maxValue: 0,
				defaultValue: 0
			},
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
				name: 'sustain',
				defaultValue: 1,
				minValue: 0,
				maxValue: 1
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

	finishEnvelopeAt = null;

	process(inputList, outputList, parameters) {
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

				this.lastValueOfPreviousProcess = inp[inp.length - 1];
			});
		});

		if (triggerEnvelope) {
			const release = parameters.release;

			if (release.length === 1) {
				const releaseInMilliseconds = release[0];
				const releaseInSeconds = releaseInMilliseconds / 1000;

				this.finishEnvelopeAt = currentTime + releaseInSeconds;
			}
		}

		return true;
	}
}

registerProcessor('envelope', Envelope);
