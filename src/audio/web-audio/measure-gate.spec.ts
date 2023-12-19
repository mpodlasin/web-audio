/**
 * @jest-environment jsdom
 */
import '../mocks';
import { MeasureGate } from './measure-gate';

describe('measure-gate worklet', () => {
	it('works', () => {
		const gateLength = new MeasureGate({}, 1);

		const inputs = [
           [[new Float32Array([1, 0, 0, 0, 0, 0])]],
            [[new Float32Array([0, 0, 1, 0, 0, 0])]]
        ];

		const outputs = [
            [[new Float32Array([0, 0, 0, 0, 0, 0])]],
            [[new Float32Array([0, 0, 0, 0, 0, 0])]],
        ];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			gateLength.process(
				input,
				output,
				{},
				index * 6
			);
		});

        const x = 8;

		expect([...(outputs[1]?.[0]?.[0] ?? [])]).toEqual([0, 0, x, x, x, x]);
	});
});
