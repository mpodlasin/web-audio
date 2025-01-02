class ScalerProcessor extends AudioWorkletProcessor {
	private WEBEAUDIO_FRAME_SIZE: number;
	private inputBuffer: Float32Array = new Float32Array();
	private outputBuffer: Float32Array = new Float32Array();
	private fromToBuffer: Float32Array = new Float32Array();
	private nativeProcess: ((currentFrame: number, sampleRate: number) => void) | undefined =
		undefined;
	private debug: (() => number) | undefined = undefined;
	private kill = false;

	static get parameterDescriptors() {
		return [
			{
				name: 'a-from',
				defaultValue: -1,
				minValue: Number.MIN_SAFE_INTEGER,
				maxValue: Number.MAX_SAFE_INTEGER
			},
			{
				name: 'a-to',
				defaultValue: 0,
				minValue: Number.MIN_SAFE_INTEGER,
				maxValue: Number.MAX_SAFE_INTEGER
			},
			{
				name: 'b-from',
				defaultValue: 1,
				minValue: Number.MIN_SAFE_INTEGER,
				maxValue: Number.MAX_SAFE_INTEGER
			},
			{
				name: 'b-to',
				defaultValue: 1,
				minValue: Number.MIN_SAFE_INTEGER,
				maxValue: Number.MAX_SAFE_INTEGER
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
			if (e.data === 'kill') {
				this.kill = true;
				return;
			}

			WebAssembly.instantiate(e.data).then((result) => {
				const exports = result.instance.exports as any;

				const inputBufferPtr = exports.inputBufferPtr();
				const outputBufferPtr = exports.outputBufferPtr();
				const fromToPtr = exports.fromToPtr();

				this.fromToBuffer = new Float32Array(exports.memory.buffer, fromToPtr, 4);
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

		const fromTo = [
			parameters['a-from']?.[0] ?? 0,
			parameters['a-to']?.[0] ?? 0,
			parameters['b-from']?.[0] ?? 0,
			parameters['b-to']?.[0] ?? 0
		];
		this.fromToBuffer.set(fromTo);

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
registerProcessor('scaler', ScalerProcessor);
