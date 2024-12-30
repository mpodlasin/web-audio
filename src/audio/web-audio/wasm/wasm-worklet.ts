class WorkletProcessor extends AudioWorkletProcessor {
	private WEBEAUDIO_FRAME_SIZE: number;
	private leftInputBuffer: any;
	private leftOutputBuffer: any;
	private rightInputBuffer: any;
	private rightOutputBuffer: any;
	private filter: any;

	constructor() {
		super();
		this.WEBEAUDIO_FRAME_SIZE = 128;

		this.port.onmessage = (e) => {
			WebAssembly.instantiate(e.data).then((result) => {
				const exports = result.instance.exports as any;

				const leftInputBufferPtr = exports.leftInputBufferPtr();
				const rightInputBufferPtr = exports.rightInputBufferPtr();
				const leftOutputBufferPtr = exports.leftOutputBufferPtr();
				const rightOutputBufferPtr = exports.rightOutputBufferPtr();

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
				this.leftOutputBuffer = new Float32Array(
					exports.memory.buffer,
					leftOutputBufferPtr,
					this.WEBEAUDIO_FRAME_SIZE
				);
				this.rightOutputBuffer = new Float32Array(
					exports.memory.buffer,
					rightOutputBufferPtr,
					this.WEBEAUDIO_FRAME_SIZE
				);
				this.filter = exports.filter;
			});
		};
	}
	process(inputList: Float32Array[][], outputList: Float32Array[][]) {
		this.leftInputBuffer.set(inputList[0]?.[0]);
		this.rightInputBuffer.set(inputList[0]?.[1]);

		this.filter();

		outputList[0]?.[0]?.set(this.leftOutputBuffer);
		outputList[0]?.[1]?.set(this.rightOutputBuffer);

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
