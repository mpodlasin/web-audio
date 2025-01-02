class OscillatorProcessor extends AudioWorkletProcessor {
	private WEBEAUDIO_FRAME_SIZE: number;
	private inputBuffer: Float32Array = new Float32Array();
	private outputBuffer: Float32Array = new Float32Array();
	private frequencyBuffer: Float32Array = new Float32Array();
	private nativeProcess: ((currentFrame: number, sampleRate: number) => void) | undefined = undefined;
	private debug: (() => number) | undefined = undefined;
	private kill = false;

	static get parameterDescriptors() {
		return [
			{
				name: 'frequency',
				defaultValue: 0,
				minValue: 0,
				maxValue: 1000
			},
		];
	}

	constructor(
		options: AudioWorkletNodeOptions | undefined,
		private _sampleRate: number = sampleRate
	) {
		super(options);
		this.WEBEAUDIO_FRAME_SIZE = 128;

		this.port.onmessage = (e) => {
			if (e.data === 'kill') {
				this.kill = true;
				return;
			}

			WebAssembly.instantiate(e.data).then((result) => {
				const exports = result.instance.exports as any;

				const inputBufferPtr = exports.inputBufferPtr();
				const outputBufferPtr = exports.outputBufferPtr();
				const frequencyPtr = exports.frequencyPtr();

				this.frequencyBuffer = new Float32Array(exports.memory.buffer, frequencyPtr, 1);
				this.inputBuffer = new Float32Array(
					exports.memory.buffer,
					inputBufferPtr,
					this.WEBEAUDIO_FRAME_SIZE
				);
				this.outputBuffer = new Float32Array(
					exports.memory.buffer,
					outputBufferPtr,
					this.WEBEAUDIO_FRAME_SIZE
				);
				this.nativeProcess = exports.process;
				this.debug = exports.debug;
			});
		};
	}

	process(
		inputList: Float32Array[][],
		outputList: Float32Array[][],
		parameters: Record<string, Float32Array>,
		_currentFrame = currentFrame
	) {
		if (this.kill) return false;
		if (!this.nativeProcess) return true;

		const frequency = [parameters['frequency']?.[0] ?? 0];
		this.frequencyBuffer.set(frequency);

		const input = inputList[0]?.[0];

		if (input) {
			this.inputBuffer.set(input);
		}

		this.nativeProcess(_currentFrame, this._sampleRate);
		this.debug && console.log(this.debug());

		outputList[0]?.[0]?.set(this.outputBuffer);

		return true;
	}
}
registerProcessor('custom-oscillator', OscillatorProcessor);
