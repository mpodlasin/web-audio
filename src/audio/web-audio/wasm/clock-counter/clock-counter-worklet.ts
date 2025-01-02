class ClockCounterProcessor extends AudioWorkletProcessor {
	private WEBEAUDIO_FRAME_SIZE: number;
	private inputBuffer: Float32Array = new Float32Array();
	private outputBuffer: Float32Array = new Float32Array();
	private moduloParameterBuffer: Float32Array = new Float32Array();
	private nativeProcess: ((currentFrame: number, sampleRate: number) => void) | undefined = undefined;
	private debug: (() => number) | undefined = undefined;

	static get parameterDescriptors() {
		return [
			{
				name: 'modulo',
				minValue: 0,
				maxValue: Number.MAX_SAFE_INTEGER,
				defaultValue: 1
			}
		];
	}

	constructor(
		options: AudioWorkletNodeOptions | undefined,
		private _sampleRate: number = sampleRate
	) {
		super(options);
		this.WEBEAUDIO_FRAME_SIZE = 128;

		this.port.onmessage = (e) => {
			WebAssembly.instantiate(e.data).then((result) => {
				const exports = result.instance.exports as any;

				const inputBufferPtr = exports.inputBufferPtr();
				const outputBufferPtr = exports.outputBufferPtr();
				const moduloParameterPtr = exports.moduloParameterPtr();

				this.moduloParameterBuffer = new Float32Array(exports.memory.buffer, moduloParameterPtr, 1);
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
		if (!this.nativeProcess) return true;

		const moduloParameter = parameters['modulo'];

		if (moduloParameter) {
			this.moduloParameterBuffer.set(moduloParameter);
		}

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
registerProcessor('clock-counter', ClockCounterProcessor);
