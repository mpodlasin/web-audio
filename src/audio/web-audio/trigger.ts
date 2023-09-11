class Trigger extends AudioWorkletProcessor {
	constructor() {
		super();
	}

	static get parameterDescriptors() {
		return [
			{
				name: 'tempoInBPM',
				defaultValue: 120,
				minValue: 0,
				maxValue: 1000
			}
		];
	}

	process(
		inputList: Float32Array[][],
		outputList: Float32Array[][],
		parameters: Record<string, Float32Array>
	) {
		const tempoInBPM = parameters.tempoInBPM;

		if (tempoInBPM && tempoInBPM.length === 1) {
			const tempoPerSecond = (tempoInBPM[0] ?? 0) / 60;
			const lengthInSeconds = 1 / (tempoPerSecond * 2);
			const frameInSeconds = lengthInSeconds * 2;

			outputList.forEach((output) => {
				output.forEach((out) => {
					for (let i = 0; i < out.length; i++) {
						const now = currentTime % frameInSeconds;

						if (now <= lengthInSeconds) {
							out[i] = 1;
						} else {
							out[i] = 0;
						}
					}
				});
			});
		}

		return true;
	}
}

registerProcessor('trigger', Trigger);
