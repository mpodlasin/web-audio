/**
 * @jest-environment jsdom
 */
import '../mocks';
import { AREnvelope } from './ar-envelope';

describe('ar-envelope worklet', () => {
	it('passes signal unchanged with one frame', () => {
		const envelope = new AREnvelope({}, 44100);

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
		const envelope = new AREnvelope({}, 44100);

		const inputs = [
			[[new Float32Array([0, 0, 1, 1, 1, 1])]],
			[[new Float32Array([1, 1, 0, 0, 0, 0])]]
		];

		const outputs = [
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]]
		];

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
		const envelope = new AREnvelope({}, 44100);

		const inputs = [
			[[new Float32Array([0, 0, 1, 1, 1, 1])]],
			[[new Float32Array([1, 1, 1, 1, 1, 1])]],
			[[new Float32Array([1, 1, 0, 0, 0, 0])]]
		];

		const outputs = [
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]]
		];

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

	it('passess signal unchanged twice on three frames', () => {
		const envelope = new AREnvelope({}, 44100);

		const inputs = [
			[[new Float32Array([0, 0, 1, 1, 1, 1])]],
			[[new Float32Array([1, 0, 0, 0, 1, 1])]],
			[[new Float32Array([1, 1, 0, 0, 0, 0])]]
		];

		const outputs = [
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]]
		];

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
		expect([...(outputs[1]?.[0]?.[0] ?? [])]).toEqual([1, 0, 0, 0, 1, 1]);
		expect([...(outputs[2]?.[0]?.[0] ?? [])]).toEqual([1, 1, 0, 0, 0, 0]);
	});

	it('performs attack on one frame', () => {
		const sampleLength = 44100;
		const envelope = new AREnvelope({}, sampleLength);

		const inputs = [[[new Float32Array([0, 0, 1, 1, 1, 0])]]];

		const outputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			envelope.process(
				input,
				output,
				{
					attack: new Float32Array([(2 * 1000) / sampleLength]), // 2 samples
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
		const envelope = new AREnvelope({}, sampleLength);

		const inputs = [
			[[new Float32Array([0, 0, 0, 1, 1, 1])]],
			[[new Float32Array([1, 1, 1, 0, 0, 0])]]
		];

		const outputs = [
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]]
		];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			envelope.process(
				input,
				output,
				{
					attack: new Float32Array([(4 * 1000) / sampleLength]), // 4 samples
					release: new Float32Array([0]),
					running: new Float32Array([1])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 0, 0, 0.25, 0.5]);
		expect([...(outputs[1]?.[0]?.[0] ?? [])]).toEqual([0.75, 1, 1, 0, 0, 0]);
	});

	it('performs release on one frame', () => {
		const envelope = new AREnvelope({}, 44100);

		const inputs = [[[new Float32Array([0, 1, 1, 0, 0, 0])]]];

		const outputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			envelope.process(
				input,
				output,
				{
					attack: new Float32Array([0]),
					release: new Float32Array([(2 * 1000) / 44100]), // 2 samples
					running: new Float32Array([1])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 1, 1, 1, 0.5, 0]);
	});

	it('performs release on two frames', () => {
		const envelope = new AREnvelope({}, 44100);

		const inputs = [
			[[new Float32Array([0, 0, 1, 1, 1, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]]
		];

		const outputs = [
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]]
		];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			envelope.process(
				input,
				output,
				{
					attack: new Float32Array([0]),
					release: new Float32Array([(4 * 1000) / 44100]), // 4 samples
					running: new Float32Array([1])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 1, 1, 1, 1]);
		expect([...(outputs[1]?.[0]?.[0] ?? [])]).toEqual([0.75, 0.5, 0.25, 0, 0, 0]);
	});

	it('performs attack and release on two frames', () => {
		const envelope = new AREnvelope({}, 44100);

		const inputs = [
			[[new Float32Array([0, 0, 1, 1, 1, 1])]],
			[[new Float32Array([1, 1, 1, 0, 0, 0])]]
		];

		const outputs = [
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]]
		];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			envelope.process(
				input,
				output,
				{
					attack: new Float32Array([(2 * 1000) / 44100]), // 2 samples
					release: new Float32Array([(2 * 1000) / 44100]), // 2 samples
					running: new Float32Array([1])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 0, 0.5, 1, 1]);
		expect([...(outputs[1]?.[0]?.[0] ?? [])]).toEqual([1, 1, 1, 1, 0.5, 0]);
	});

	it('performs attack and release twice on three frames', () => {
		const envelope = new AREnvelope({}, 44100);

		const inputs = [
			[[new Float32Array([0, 0, 1, 1, 1, 1])]],
			[[new Float32Array([1, 0, 0, 0, 1, 1])]],
			[[new Float32Array([1, 1, 0, 0, 0, 0])]]
		];

		const outputs = [
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]]
		];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			envelope.process(
				input,
				output,
				{
					attack: new Float32Array([(2 * 1000) / 44100]), // 2 samples
					release: new Float32Array([(2 * 1000) / 44100]), // 2 samples
					running: new Float32Array([1])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 0, 0.5, 1, 1]);
		expect([...(outputs[1]?.[0]?.[0] ?? [])]).toEqual([1, 1, 0.5, 0, 0, 0.5]);
		expect([...(outputs[2]?.[0]?.[0] ?? [])]).toEqual([1, 1, 1, 0.5, 0, 0]);
	});

	it('behaves well for short trigger', () => {
		const envelope = new AREnvelope({}, 44100);

		const inputs = [[[new Float32Array([0, 0, 1, 0, 0, 0])]]];

		const outputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			envelope.process(
				input,
				output,
				{
					attack: new Float32Array([(0 * 1000) / 44100]), // 0 samples
					release: new Float32Array([(2 * 1000) / 44100]), // 2 samples
					running: new Float32Array([1])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 1, 1, 0.5, 0]);
	});

	it('behaves well if release starts before attack ends', () => {
		const envelope = new AREnvelope({}, 44100);

		const inputs = [
			[[new Float32Array([0, 0, 0, 1, 1, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]]
		];

		const outputs = [
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]]
		];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			envelope.process(
				input,
				output,
				{
					attack: new Float32Array([(4 * 1000) / 44100]), // 2 samples
					release: new Float32Array([(2 * 1000) / 44100]), // 2 samples
					running: new Float32Array([1])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 0, 0, 0.25, 0.5]);
		expect([...(outputs[1]?.[0]?.[0] ?? [])]).toEqual([0.25, 0, 0, 0, 0, 0]);
	});

	it('behaves well when two releases take place in single frame', () => {
		const envelope = new AREnvelope({}, 44100);

		const inputs = [
			[[new Float32Array([0, 0, 0, 1, 1, 0])]],
			[[new Float32Array([0, 0, 0, 1, 0, 0])]]
		];

		const outputs = [
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]]
		];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			envelope.process(
				input,
				output,
				{
					attack: new Float32Array([(0 * 1000) / 44100]), // 2 samples
					release: new Float32Array([(2 * 1000) / 44100]), // 2 samples
					running: new Float32Array([1])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 0, 1, 1, 1]);
		expect([...(outputs[1]?.[0]?.[0] ?? [])]).toEqual([0.5, 0, 0, 1, 1, 0.5]);
	});

	it('behaves well if release still takes place when immediate attack happens', () => {
		const envelope = new AREnvelope({}, 44100);

		const inputs = [
			[[new Float32Array([0, 0, 0, 1, 1, 0])]],
			[[new Float32Array([0, 1, 1, 0, 0, 0])]]
		];

		const outputs = [
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]]
		];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			envelope.process(
				input,
				output,
				{
					attack: new Float32Array([(0 * 1000) / 44100]), // 2 samples
					release: new Float32Array([(4 * 1000) / 44100]), // 2 samples
					running: new Float32Array([1])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 0, 1, 1, 1]);
		expect([...(outputs[1]?.[0]?.[0] ?? [])]).toEqual([0.75, 1, 1, 1, 0.75, 0.5]);
	});
});
