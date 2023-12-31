/* mocks for web audio api */

export class AudioParamMock {
	public value: number;

	constructor() {
		this.value = 0;
	}
}

export class OscillatorNodeMock {
	public connect: jest.Mock;
	public disconnect: jest.Mock;
	public frequency: AudioParamMock;
	public detune: AudioParamMock;
	public type: OscillatorType;
	public start: jest.Mock;
	public stop: jest.Mock;

	constructor() {
		this.connect = jest.fn((a) => a);
		this.disconnect = jest.fn();
		this.frequency = new AudioParamMock();
		this.detune = new AudioParamMock();
		this.type = 'sine';
		this.start = jest.fn();
		this.stop = jest.fn();
	}
}

export class AnalyserNodeMock {
	public connect: jest.Mock;
	public disconnect: jest.Mock;

	constructor() {
		this.connect = jest.fn((a) => a);
		this.disconnect = jest.fn();
	}
}

export class GainNodeMock {
	public connect: jest.Mock;
	public disconnect: jest.Mock;
	public gain: AudioParamMock;

	constructor() {
		this.connect = jest.fn((a) => a);
		this.disconnect = jest.fn();
		this.gain = new AudioParamMock();
	}
}

export class ConstantSourceNodeMock {
	public connect: jest.Mock;
	public disconnect: jest.Mock;
	public offset: AudioParamMock;
	public start: jest.Mock;
	public stop: jest.Mock;

	constructor() {
		this.connect = jest.fn((a) => a);
		this.disconnect = jest.fn();
		this.offset = new AudioParamMock();
		this.start = jest.fn();
		this.stop = jest.fn();
	}
}

export class StereoPannerNodeMock {
	public connect: jest.Mock;
	public disconnect: jest.Mock;
	public pan: AudioParamMock;

	constructor() {
		this.connect = jest.fn((a) => a);
		this.disconnect = jest.fn();
		this.pan = new AudioParamMock();
	}
}

export class BiquadFilterNodeMock {
	public connect: jest.Mock;
	public disconnect: jest.Mock;
	public frequency: AudioParamMock;

	constructor() {
		this.connect = jest.fn((a) => a);
		this.disconnect = jest.fn();
		this.frequency = new AudioParamMock();
	}
}

export class DelayNodeMock {
	public connect: jest.Mock;
	public disconnect: jest.Mock;

	constructor() {
		this.connect = jest.fn((a) => a);
		this.disconnect = jest.fn();
	}
}

export const destinationMock = {
	connect: jest.fn()
};

export const audioContextMock = {
	createOscillator: jest.fn(() => new OscillatorNodeMock()),
	createGain: jest.fn(() => new GainNodeMock()),
	createAnalyser: jest.fn(() => new AnalyserNodeMock()),
	createStereoPanner: jest.fn(() => new StereoPannerNodeMock()),
	createConstantSource: jest.fn(() => new ConstantSourceNodeMock()),
	destination: destinationMock
};

export class AudioWorkletNodeMock {
	public connect: jest.Mock;
	public disconnect: jest.Mock;
	public parameters: Pick<Map<string, AudioParamMock>, 'get'>;
	constructor() {
		this.connect = jest.fn((a) => a);
		this.disconnect = jest.fn();
		this.parameters = {
			get() {
				return new AudioParamMock();
			}
		};
	}
}

export class AudioWorkletProcessorMock {}

export const registerProcessorMock = jest.fn();

Object.defineProperty(window, 'AudioContext', {
	writable: true,
	value: jest.fn(() => audioContextMock)
});

Object.defineProperty(window, 'OscillatorNode', {
	writable: true,
	value: OscillatorNodeMock
});

Object.defineProperty(window, 'GainNode', {
	writable: true,
	value: GainNodeMock
});

Object.defineProperty(window, 'AudioParam', {
	writable: true,
	value: AudioParamMock
});

Object.defineProperty(window, 'AudioWorkletNode', {
	writable: true,
	value: AudioWorkletNodeMock
});

Object.defineProperty(window, 'AudioWorkletProcessor', {
	writable: true,
	value: AudioWorkletProcessorMock
});

Object.defineProperty(window, 'StereoPannerNode', {
	writable: true,
	value: StereoPannerNodeMock
});

Object.defineProperty(window, 'BiquadFilterNode', {
	writable: true,
	value: BiquadFilterNodeMock
});

Object.defineProperty(window, 'DelayNode', {
	writable: true,
	value: DelayNodeMock
});

Object.defineProperty(window, 'registerProcessor', {
	writable: true,
	value: registerProcessorMock
});

/* For audio processor nodes tests */

Object.defineProperty(window, 'sampleRate', {
	writable: true,
	value: 44100
});

Object.defineProperty(window, 'currentTime', {
	writable: true,
	value: 0
});

Object.defineProperty(window, 'navigator', {
	writable: true,
	value: {
		requestMIDIAccess: () => Promise.resolve({ inputs: [] })
	}
});
