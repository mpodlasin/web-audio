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
		this.connect = jest.fn();
		this.disconnect = jest.fn();
		this.frequency = new AudioParamMock();
		this.detune = new AudioParamMock();
		this.type = 'sine';
		this.start = jest.fn();
		this.stop = jest.fn();
	}
}

export class GainNodeMock {
	public connect: jest.Mock;
	public disconnect: jest.Mock;
	public gain: AudioParamMock;

	constructor() {
		this.connect = jest.fn();
		this.disconnect = jest.fn();
		this.gain = new AudioParamMock();
	}
}

export const destinationMock = {
	connect: jest.fn()
};

export const audioContextMock = {
	createOscillator: jest.fn(() => new OscillatorNodeMock()),
	createGain: jest.fn(() => new GainNodeMock()),
	destination: destinationMock
};

export class AudioWorkletNodeMock {
	public connect: jest.Mock;

	constructor() {
		this.connect = jest.fn();
	}
}

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
