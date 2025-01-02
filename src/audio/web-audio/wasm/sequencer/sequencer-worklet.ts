class SequencerProcessor extends AudioWorkletProcessor {
	private WEBEAUDIO_FRAME_SIZE: number;
	private inputBuffer: Float32Array = new Float32Array();
	private outputBuffer: Float32Array = new Float32Array();
	private frequenciesBuffer: Float32Array = new Float32Array();
	private nativeProcess: ((currentFrame: number, sampleRate: number) => void) | undefined =
		undefined;
	private debug: (() => number) | undefined = undefined;
	private kill = false;

	static get parameterDescriptors() {
		const createFrequencyDescriptor = (name: string) => ({
			name,
			defaultValue: 440,
			minValue: 0,
			maxValue: 20000
		});

		return [1, 2, 3, 4, 5, 6, 7, 8].map((i) => `frequency${i}`).map(createFrequencyDescriptor);
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
				const frequenciesPtr = exports.frequenciesPtr();

				this.frequenciesBuffer = new Float32Array(exports.memory.buffer, frequenciesPtr, 8);
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

		const frequencies = [
			parameters.frequency1?.[0] ?? 0,
			parameters.frequency2?.[0] ?? 0,
			parameters.frequency3?.[0] ?? 0,
			parameters.frequency4?.[0] ?? 0,
			parameters.frequency5?.[0] ?? 0,
			parameters.frequency6?.[0] ?? 0,
			parameters.frequency7?.[0] ?? 0,
			parameters.frequency8?.[0] ?? 0
		];
		this.frequenciesBuffer.set(frequencies);

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
registerProcessor('sequencer', SequencerProcessor);
