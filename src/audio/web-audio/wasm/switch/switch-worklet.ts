class SwitchProcessor extends AudioWorkletProcessor {
	private WEBEAUDIO_FRAME_SIZE: number;
	private inputBufferA: Float32Array = new Float32Array();
	private inputBufferB: Float32Array = new Float32Array();
	private inputBufferC: Float32Array = new Float32Array();
	private inputBufferD: Float32Array = new Float32Array();
	private outputBuffer: Float32Array = new Float32Array();
	private chosenInputBuffer: Float32Array = new Float32Array();
	private nativeProcess: ((currentFrame: number, sampleRate: number) => void) | undefined =
		undefined;
	private debug: (() => number) | undefined = undefined;
	private kill = false;

	static get parameterDescriptors() {
        return [{
            name: 'input',
            defaultValue: 1,
            minValue: 1,
            maxValue: 4,
        }];
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

				const inputBufferPtrA = exports.inputBufferPtrA();
				const inputBufferPtrB = exports.inputBufferPtrB();
				const inputBufferPtrC = exports.inputBufferPtrC();
				const inputBufferPtrD = exports.inputBufferPtrD();
				const outputBufferPtr = exports.outputBufferPtr();
				const chosenInputPtr = exports.chosenInputPtr();

				this.chosenInputBuffer = new Float32Array(exports.memory.buffer, chosenInputPtr, 1);
				this.inputBufferA = new Float32Array(
					exports.memory.buffer,
					inputBufferPtrA,
					this.WEBEAUDIO_FRAME_SIZE
				);
				this.inputBufferB = new Float32Array(
					exports.memory.buffer,
					inputBufferPtrB,
					this.WEBEAUDIO_FRAME_SIZE
				);
				this.inputBufferC = new Float32Array(
					exports.memory.buffer,
					inputBufferPtrC,
					this.WEBEAUDIO_FRAME_SIZE
				);
				this.inputBufferD = new Float32Array(
					exports.memory.buffer,
					inputBufferPtrD,
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

    const chosenInput = parameters['input']?.[0] ?? 0;

		this.chosenInputBuffer.set([chosenInput]);

		const inputA = inputList[0]?.[0];

		if (inputA) {
			this.inputBufferA.set(inputA);
		}

		const inputB = inputList[1]?.[0];

		if (inputB) {
			this.inputBufferB.set(inputB);
		}

		const inputC = inputList[2]?.[0];

		if (inputC) {
			this.inputBufferC.set(inputC);
		}

		const inputD = inputList[3]?.[0];

		if (inputD) {
			this.inputBufferD.set(inputD);
		}

		this.nativeProcess(_currentFrame, this._sampleRate);
		this.debug && console.log(this.debug());

		outputList[0]?.[0]?.set(this.outputBuffer);
		return true;
	}
}
registerProcessor('switch', SwitchProcessor);
