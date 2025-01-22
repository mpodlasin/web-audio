class DualWorkletProcessor extends AudioWorkletProcessor {
	private WEBEAUDIO_FRAME_SIZE: number;
	private leftInputBuffer: Float32Array = new Float32Array();
	private rightInputBuffer: Float32Array = new Float32Array();
	private outputBuffer: Float32Array = new Float32Array();
	private nativeProcess: ((currentFrame: number, sampleRate: number) => void) | undefined =
		undefined;
	private debug: (() => number) | undefined = undefined;
	private kill = false;

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

				const leftInputBufferPtr = exports.leftInputBufferPtr();
				const rightInputBufferPtr = exports.rightInputBufferPtr();
				const outputBufferPtr = exports.outputBufferPtr();

				this.leftInputBuffer = new Float32Array(
					exports.memory.buffer,
					leftInputBufferPtr,
					this.WEBEAUDIO_FRAME_SIZE
				);
				this.rightInputBuffer = new Float32Array(
					exports.memory.buffer,
					rightInputBufferPtr,
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

		const leftInput = inputList[0]?.[0];

		if (leftInput) {
			this.leftInputBuffer.set(leftInput);
		}

		const rightInput = inputList[0]?.[0];

		if (rightInput) {
			this.leftInputBuffer.set(rightInput);
		}

		this.nativeProcess(_currentFrame, this._sampleRate);
		this.debug && console.log(this.debug());

		outputList[0]?.[0]?.set(this.outputBuffer);

		return true;
	}
}
registerProcessor('wasm-dual', DualWorkletProcessor);
