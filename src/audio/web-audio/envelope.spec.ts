/**
 * @jest-environment jsdom
 */
import '../mocks';
import { Envelope } from './envelope';

describe('envelope worklet', () => {
	it('passes signal unchanged with one frame', () => {
		const envelope = new Envelope(44100);

		const inputs = [[[new Float32Array([0, 0, 1, 1, 0, 0])]]];

		const outputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			envelope.process(
				input,
				output,
				{
					attack: new Float32Array([0]),
					release: new Float32Array([0]),
					running: new Float32Array([1])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 1, 1, 0, 0]);
	});

	it('passess signal unchanged with two frames', () => {
		const envelope = new Envelope(44100);

		const inputs = [[[new Float32Array([0, 0, 1, 1, 1, 1])]], [[new Float32Array([1, 1, 0, 0, 0, 0])]]];

		const outputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]], [[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			envelope.process(
				input,
				output,
				{
					attack: new Float32Array([0]),
					release: new Float32Array([0]),
					running: new Float32Array([1])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 1, 1, 1, 1]);
		expect([...(outputs[1]?.[0]?.[0] ?? [])]).toEqual([1, 1, 0, 0, 0, 0]);
	});

	it('passess signal unchanged with three frames', () => {
		const envelope = new Envelope(44100);

		const inputs = [[[new Float32Array([0, 0, 1, 1, 1, 1])]], [[new Float32Array([1, 1, 1, 1, 1, 1])]], [[new Float32Array([1, 1, 0, 0, 0, 0])]]];

		const outputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]], [[new Float32Array([0, 0, 0, 0, 0, 0])]], [[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			envelope.process(
				input,
				output,
				{
					attack: new Float32Array([0]),
					release: new Float32Array([0]),
					running: new Float32Array([1])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 1, 1, 1, 1]);
		expect([...(outputs[1]?.[0]?.[0] ?? [])]).toEqual([1, 1, 1, 1, 1, 1]);
		expect([...(outputs[2]?.[0]?.[0] ?? [])]).toEqual([1, 1, 0, 0, 0, 0]);
	});

	it('performs attack on one frame', () => {
		const sampleLength = 44100;
		const envelope = new Envelope(sampleLength);

		const inputs = [[[new Float32Array([0, 0, 1, 1, 1, 0])]]];

		const outputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			envelope.process(
				input,
				output,
				{
					attack: new Float32Array([ 2 * 1000 / sampleLength  ]), // 2 samples
					release: new Float32Array([0]),
					running: new Float32Array([1])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 0, 0.5, 1, 0]);
	});

	it('performs attack on two frames', () => {
		const sampleLength = 44100;
		const envelope = new Envelope(sampleLength);

		const inputs = [[[new Float32Array([0, 0, 0, 1, 1, 1])]], [[new Float32Array([1, 1, 1, 0, 0, 0])]]];

		const outputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]], [[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			envelope.process(
				input,
				output,
				{
					attack: new Float32Array([ 4 * 1000 / sampleLength  ]), // 2 samples
					release: new Float32Array([0]),
					running: new Float32Array([1])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 0, 0, 0.25, 0.5]);
		expect([...(outputs[1]?.[0]?.[0] ?? [])]).toEqual([0.75, 1, 1, 0, 0, 0]);
	});
});
