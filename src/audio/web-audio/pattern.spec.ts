/**
 * @jest-environment jsdom
 */
import '../mocks';
import { Pattern } from './pattern';

describe('pattern worklet', () => {
	it('works', () => {
		const pattern = new Pattern({}, 44100);

		const inputs = [[[new Float32Array([1, 0, 1, 0, 0, 1])]]];

		const outputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			pattern.process(
				input,
				output,
				{
					step1: new Float32Array([1]),
					step2: new Float32Array([0]),
					steps: new Float32Array([2])
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([1, 0, 0, 0, 0, 1]);
	});
});
