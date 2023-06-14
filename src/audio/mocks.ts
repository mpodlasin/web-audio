/* mocks for web audio api */

export class OscillatorNodeMock {
	public connect: jest.Mock;
	public disconnect: jest.Mock;
	public frequency: {
		value: number;
	};
	public type: OscillatorType;
	public start: jest.Mock;
	public stop: jest.Mock;

	constructor() {
		this.connect = jest.fn();
		this.disconnect = jest.fn();
		this.frequency = {
			value: 0
		};
		this.type = 'sine';
		this.start = jest.fn();
		this.stop = jest.fn();
	}
}

export class GainNodeMock {
	public connect: jest.Mock;
	public gain: {
		value: number;
	};

	constructor() {
		this.connect = jest.fn();
		this.gain = {
			value: 0
		};
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

Object.defineProperty(window, 'AudioContext', {
	writable: true,
	value: jest.fn(() => audioContextMock)
});
