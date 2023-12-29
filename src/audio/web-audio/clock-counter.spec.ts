/**
 * @jest-environment jsdom
 */
import '../mocks';
import { ClockCounter } from './clock-counter';

describe('clock-counter worklet', () => {
	it('works', () => {
		const pattern = new ClockCounter({}, 44100);

		const inputs = [[[new Float32Array([1, 0, 1, 0, 0, 1])]]];

		const outputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			pattern.process(
				input,
				output,
				{
					modulo: new Float32Array([4])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([1, 1, 2, 2, 2, 3]);
	});

	it('works with modulo parameter', () => {
		const pattern = new ClockCounter({}, 44100);

		const inputs = [[[new Float32Array([1, 0, 1, 0, 0, 1])]]];

		const outputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			pattern.process(
				input,
				output,
				{
					modulo: new Float32Array([2])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([1, 1, 0, 0, 0, 1]);
	});
});
