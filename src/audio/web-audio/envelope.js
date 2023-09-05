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
	enveloping = false;
	nrOfEnvelopedFrames = 0;

	process(inputList, outputList, parameters) {
		if (this.enveloping) {
			if (this.nrOfEnvelopedFrames < 100000) {
				outputList.forEach((output) => {
					output.forEach((out) => {
						for (let i = 0; i < out.length; i++) {
							out[i] = 1;
						}
					});
				});
				this.nrOfEnvelopedFrames++;
			} else {
				this.enveloping = false;
				this.nrOfEnvelopedFrames = 0;
			}
		}

		inputList.forEach((input) => {
			input.forEach((inp) => {
				this.lastValueOfPreviousProcess = inp[inp.length - 1];

				let triggerEnvelope = false;
				if (this.lastValueOfPreviousProcess === 0 && inp[0] === 1) {
					triggerEnvelope = true;
				} else {
					for (let i = 0; i < inp.length - 1; i++) {
						if (inp[i] === 0 && inp[i + 1] === 1) {
							triggerEnvelope = true;
						}
					}
				}

				if (triggerEnvelope) {
					this.enveloping = true;
				}
			});
		});

		return true;
	}
}

registerProcessor('envelope', Envelope);
