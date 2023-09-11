/**
 * @jest-environment jsdom
 */
import '../mocks';
import { Trigger } from './trigger';

describe('trigger worklet', () => {
	it('can be created', () => {
		const trigger = new Trigger();
	});
});
