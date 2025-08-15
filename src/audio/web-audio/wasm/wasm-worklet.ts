class WorkletProcessor extends AudioWorkletProcessor {
	private WEBEAUDIO_FRAME_SIZE: number;
	private inputBuffer: Float32Array = new Float32Array();
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

				const inputBufferPtr = exports.inputBufferPtr();
				const outputBufferPtr = exports.outputBufferPtr();

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

		const input = inputList[0]?.[0];

		console.log(input);

		if (input) {
			this.inputBuffer.set(input);
		}

		this.nativeProcess(_currentFrame, this._sampleRate);
		this.debug && console.log(this.debug());

		outputList[0]?.[0]?.set(this.outputBuffer);

		return true;
	}
}
registerProcessor('wasm', WorkletProcessor);

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
