class PatternProcessor extends AudioWorkletProcessor {
	private WEBEAUDIO_FRAME_SIZE: number;
	private inputBuffer: Float32Array = new Float32Array();
	private outputBuffer: Float32Array = new Float32Array();
	private stepsBuffer: Float32Array = new Float32Array();
	private nativeProcess: ((currentFrame: number, sampleRate: number) => void) | undefined = undefined;
	private debug: (() => number) | undefined = undefined;

	static get parameterDescriptors() {
		return [
			...[1, 2, 3, 4, 5, 6, 7, 8].map((step) => ({
				name: `step${step}`,
				defaultValue: 0,
				minValue: 0,
				maxValue: 1
			}))
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
				const stepsPtr = exports.stepsPtr();

				this.stepsBuffer = new Float32Array(exports.memory.buffer, stepsPtr, 8);
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
registerProcessor('pattern', PatternProcessor);
