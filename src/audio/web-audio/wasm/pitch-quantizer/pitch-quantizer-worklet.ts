class PitchQuantizerProcessor extends AudioWorkletProcessor {
	private WEBEAUDIO_FRAME_SIZE: number;
	private inputBuffer: Float32Array = new Float32Array();
	private outputBuffer: Float32Array = new Float32Array();
	private notesBuffer: Float32Array = new Float32Array();
	private nativeProcess: (currentFrame: number, sampleRate: number) => void = () => {
		/* do nothing */
	};
	private debug: (() => number) | undefined = undefined;

	static parameterDescriptors = [
		{ name: 'A', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'A#', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'B', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'C', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'C#', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'D', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'D#', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'E', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'F', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'F#', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'G', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'G#', defaultValue: 0, minValue: 0, maxValue: 1 }
	];

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
				const notesPtr = exports.notesPtr();

				this.notesBuffer = new Float32Array(exports.memory.buffer, notesPtr, 12);
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
		const notes = [
			parameters['A']?.[0] ?? 0,
			parameters['A#']?.[0] ?? 0,
			parameters['B']?.[0] ?? 0,
			parameters['C']?.[0] ?? 0,
			parameters['C#']?.[0] ?? 0,
			parameters['D']?.[0] ?? 0,
			parameters['D#']?.[0] ?? 0,
			parameters['E']?.[0] ?? 0,
            parameters['F']?.[0] ?? 0,
            parameters['F#']?.[0] ?? 0,
            parameters['G']?.[0] ?? 0,
            parameters['G#']?.[0] ?? 0,
		];
		this.notesBuffer.set(notes);

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
registerProcessor('pitch-quantizer', PitchQuantizerProcessor);
