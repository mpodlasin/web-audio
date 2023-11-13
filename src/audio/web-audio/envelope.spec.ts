/**
 * @jest-environment jsdom
 */
import '../mocks';
import { Envelope } from './envelope';

describe('envelope worklet', () => {
	it('passess signal unchanged with 0 attack and 0 decay', () => {
		const envelope = new Envelope();

		const inputs = [
			[[
			new Float32Array([0, 0, 1, 1, 1, 1]),
			new Float32Array([0, 0, 1, 1, 1, 1]),
		]],
		[[
			new Float32Array([1, 1, 1, 1, 0, 0]),
			new Float32Array([1, 1, 1, 1, 0, 0]),
		]]
	];

	const outputs = [
		[[
		new Float32Array([0, 0, 0, 0, 0, 0]),
		new Float32Array([0, 0, 0, 0, 0, 0]),
	]],
	[[
		new Float32Array([1, 1, 1, 1, 0, 0]),
		new Float32Array([1, 1, 1, 1, 0, 0]),
	]]
];

	inputs.forEach((input, index) => {
		const output = outputs[index];

		if (!output) return;

		envelope.process(input, output, { 
			attack: new Float32Array([0]),  
			release: new Float32Array([0]),
			running: new Float32Array([0]),
		});
	});


		expect([...(outputs[0]?.[0]?.[0] ?? [])]).toEqual([0, 0, 1, 1, 1, 1]);
		expect([...(outputs[0]?.[0]?.[1] ?? [])]).toEqual([0, 0, 1, 1, 1, 1]);
	});
});
