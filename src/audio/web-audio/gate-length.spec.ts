/**
 * @jest-environment jsdom
 */
import '../mocks';
import { GateLength } from './gate-length';

describe('gate-length worklet', () => {
    it('makes gate signal longer on 1 frame', () => {
        const gateLength = new GateLength({}, 44100);

		const inputs = [[[new Float32Array([1, 0, 0, 0, 0, 0])]]];

		const outputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			gateLength.process(
				input,
				output,
				{
					length: new Float32Array([3 / 44100]),
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([1, 1, 1, 0, 0, 0]);
    });

    it('makes gate signal longer on 2 frames', () => {
        const gateLength = new GateLength({}, 44100);

		const inputs = [[[new Float32Array([1, 0, 0, 0, 0, 0])]]];

		const outputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			gateLength.process(
				input,
				output,
				{
					length: new Float32Array([3 / 44100]),
				},
				index * 6
			);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([1, 1, 1, 0, 0, 0]);
    });
});
