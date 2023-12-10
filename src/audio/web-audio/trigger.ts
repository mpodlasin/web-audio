export class Trigger extends AudioWorkletProcessor {
	constructor(
		options: AudioWorkletNodeOptions | undefined,
		private _sampleRate: number = sampleRate
	) {
		super(options);
	}

	static get parameterDescriptors() {
		return [
			{
				name: 'tempo',
				defaultValue: 120,
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

	process(
		_: Float32Array[][],
		outputList: Float32Array[][],
		parameters: Record<string, Float32Array>,
		_currentFrame: number = currentFrame
	) {
		const tempoInBPM = parameters.tempo;
		const running = parameters.running;

		if (!tempoInBPM) return true;

		if (!running || running[0] === 0) return true;

		if (tempoInBPM.length === 1) {
			outputList.forEach((output) => {
				output.forEach((out) => {
					const tempoArray = out.map(() => tempoInBPM[0] ?? 0);

					this.createOutputs(out, tempoArray, _currentFrame);
				});
			});
		} else {
			outputList.forEach((output) => {
				output.forEach((out) => {
					this.createOutputs(out, tempoInBPM, _currentFrame);
				});
			});
		}

		return true;
	}

	private createOutputs(out: Float32Array, tempoInBPM: Float32Array, _currentFrame: number) {
		for (let i = 0; i < out.length; i++) {
			const tempo = tempoInBPM[i] ?? 0;
			const tempoInSamples = Math.round((this._sampleRate * 60) / tempo);

			const sampleIndex = _currentFrame + i;

			if (sampleIndex % tempoInSamples === 0) {
				out[i] = 1;
			}
		}
	}
}

registerProcessor('trigger', Trigger);

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
