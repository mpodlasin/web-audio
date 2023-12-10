/**
 * @jest-environment jsdom
 */
import '../mocks';
import { Trigger } from './trigger';

describe('trigger worklet', () => {
	it('triggers 1 on given tempo in single frame', () => {
		const trigger = new Trigger({}, 44100);

		const inputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		const outputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			trigger.process(
				input,
				output,
				{
					tempo: new Float32Array([(60 * 44100) / 3]),
					running: new Float32Array([1])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([1, 0, 0, 1, 0, 0]);
	});

	it('triggers 1 on given tempo in two frames', () => {
		const trigger = new Trigger({}, 44100);

		const inputs = [
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]]
		];

		const outputs = [
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]]
		];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			trigger.process(
				input,
				output,
				{
					tempo: new Float32Array([(60 * 44100) / 4]),
					running: new Float32Array([1])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([1, 0, 0, 0, 1, 0]);
		expect([...(outputs[1]?.[0]?.[0] ?? [])]).toEqual([0, 0, 1, 0, 0, 0]);
	});
});
