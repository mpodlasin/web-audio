/**
 * @jest-environment jsdom
 */
import '../mocks';
import { MeasureGate } from './measure-gate';

describe('measure-gate worklet', () => {
	it('measures gate length on a single frame', () => {
		const gateLength = new MeasureGate({}, 1);

		const inputs = [[[new Float32Array([1, 0, 0, 1, 0, 0])]]];

		const outputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			gateLength.process(input, output, {}, index * 6);
		});

		const x = 3;

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 0, x, x, x]);
	});

	it('measures gate length between two frames', () => {
		const gateLength = new MeasureGate({}, 1);

		const inputs = [
			[[new Float32Array([1, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 1, 0, 0, 0])]]
		];

		const outputs = [
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]]
		];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			gateLength.process(input, output, {}, index * 6);
		});

		const x = 8;

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 0, 0, 0, 0]);
		expect([...(outputs[1]?.[0]?.[0] ?? [])]).toEqual([0, 0, x, x, x, x]);
	});

	it('measures gate length between three frames', () => {
		const gateLength = new MeasureGate({}, 1);

		const inputs = [
			[[new Float32Array([1, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 1, 0, 0, 0])]]
		];

		const outputs = [
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]],
			[[new Float32Array([0, 0, 0, 0, 0, 0])]]
		];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			gateLength.process(input, output, {}, index * 6);
		});

		const x = 14;

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 0, 0, 0, 0]);
		expect([...(outputs[1]?.[0]?.[0] ?? [])]).toEqual([0, 0, 0, 0, 0, 0]);
		expect([...(outputs[2]?.[0]?.[0] ?? [])]).toEqual([0, 0, x, x, x, x]);
	});

	it('changes gate length as necessary', () => {
		const gateLength = new MeasureGate({}, 1);

		const inputs = [[[new Float32Array([1, 0, 1, 0, 0, 1])]]];

		const outputs = [[[new Float32Array([0, 0, 0, 0, 0, 0])]]];

		inputs.forEach((input, index) => {
			const output = outputs[index];

			if (!output) return;

			gateLength.process(input, output, {}, index * 6);
		});

		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 2, 2, 2, 3]);
	});
});
