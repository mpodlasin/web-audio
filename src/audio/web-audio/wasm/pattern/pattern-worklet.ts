class PatternProcessor extends AudioWorkletProcessor {
	private WEBEAUDIO_FRAME_SIZE: number;
	private leftInputBuffer: Float32Array = new Float32Array();
	private leftOutputBuffer: Float32Array = new Float32Array();
	private rightInputBuffer: Float32Array = new Float32Array();
	private rightOutputBuffer: Float32Array = new Float32Array();
	private stepsBuffer: Float32Array = new Float32Array();
	private nativeProcess: (currentFrame: number, sampleRate: number) => void = () => {
		/* do nothing */
	};
	private debug: (() => number) | undefined = undefined;

	static get parameterDescriptors() {
		return [
			...[1, 2, 3, 4, 5, 6, 7, 8].map((step) => ({
				name: `step${step}`,
				defaultValue: 0,
				minValue: 0,
				maxValue: 1
			})),
			{
				name: 'steps',
				minValue: 1,
				maxValue: 8,
				defaultValue: 8
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

				const leftInputBufferPtr = exports.leftInputBufferPtr();
				const rightInputBufferPtr = exports.rightInputBufferPtr();
				const leftOutputBufferPtr = exports.leftOutputBufferPtr();
				const rightOutputBufferPtr = exports.rightOutputBufferPtr();
				const stepsPtr = exports.stepsPtr();

				this.stepsBuffer = new Float32Array(exports.memory.buffer, stepsPtr, 8);
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
		const steps = [
			parameters.step1?.[0] ?? 0,
			parameters.step2?.[0] ?? 0,
			parameters.step3?.[0] ?? 0,
			parameters.step4?.[0] ?? 0,
			parameters.step5?.[0] ?? 0,
			parameters.step6?.[0] ?? 0,
			parameters.step7?.[0] ?? 0,
			parameters.step8?.[0] ?? 0
		];
        this.stepsBuffer.set(steps);

		const leftInput = inputList[0]?.[0];
		const rightInput = inputList[0]?.[1];

		if (leftInput) {
			this.leftInputBuffer.set(leftInput);
		}
		if (rightInput) {
			this.rightInputBuffer.set(rightInput);
		}

		this.nativeProcess(_currentFrame, this._sampleRate);
		this.debug && console.log(this.debug());

		outputList[0]?.[0]?.set(this.leftOutputBuffer);
		outputList[0]?.[1]?.set(this.rightOutputBuffer);

		return true;
	}
}
registerProcessor('pattern', PatternProcessor);
