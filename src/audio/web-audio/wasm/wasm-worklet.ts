class WorkletProcessor extends AudioWorkletProcessor {
    private WEBEAUDIO_FRAME_SIZE: number;
    private inputStart: any;
    private outputStart: any;
    private inputBuffer: any;
    private outputBuffer: any;
    private filter: any;

    constructor() {
        super();
        this.WEBEAUDIO_FRAME_SIZE = 128;

        this.port.onmessage = (e) => {
            //  Instanciate 
            WebAssembly.instantiate(e.data)
            .then((result) => {
                /* result : {module: Module, instance: Instance} */
                //  exposes C functions to the outside world. only for readness
                const exports = result.instance.exports;
                //  Gets pointer to wasm module memory
                this.inputStart   = (exports.inputBufferPtr as any)();
                this.outputStart  = (exports.outputBufferPtr as any)();
                //  Create shadow buffer of float.
                this.inputBuffer  = new Float32Array((exports.memory as any).buffer,
                                                     this.inputStart,
                                                     this.WEBEAUDIO_FRAME_SIZE);
                this.outputBuffer = new Float32Array((exports.memory as any).buffer,
                                                     this.outputStart,
                                                     this.WEBEAUDIO_FRAME_SIZE);
                //  Gets the filter function
                this.filter = exports.filter;
            });
        }
    }
    process(inputList: Float32Array[][], outputList: Float32Array[][]) {  
        this.inputBuffer.set(inputList[0]?.[0]);
        this.filter();
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