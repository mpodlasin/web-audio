/**
 * @jest-environment jsdom
 */
import { defaultGainNode, defaultSineOscillatorNode } from './fixtures';
import { update, type SerializedState } from './update';

describe('serialized/update', () => {
	it('adds a new node', () => {
		const state: SerializedState = {
			audioGraphHistory: [{}]
		};
		const expectedState: SerializedState = {
			audioGraphHistory: [
				{},
				{
					'1': defaultSineOscillatorNode
				}
			]
		};

		expect(
			update(state, {
				type: 'CREATE_NODE',
				payload: { nodeType: 'sine-oscillator', nodeId: '1', position: { x: 1, y: 2 } }
			})
		).toEqual(expectedState);
	});

	it('removes a node', () => {
		const state: SerializedState = {
			audioGraphHistory: [
				{
					'1': defaultSineOscillatorNode
				}
			]
		};
		const expectedState: SerializedState = {
			audioGraphHistory: [
				{
					'1': defaultSineOscillatorNode
				},
				{}
			]
		};

		expect(update(state, { type: 'DELETE_NODE', payload: { nodeId: '1' } })).toEqual(expectedState);
	});

	it('adds connection between two nodes', () => {
		const state: SerializedState = {
			audioGraphHistory: [
				{
					'1': defaultSineOscillatorNode,
					'2': defaultGainNode
				}
			]
		};

		const expectedState: SerializedState = {
			audioGraphHistory: [
				{
					'1': defaultSineOscillatorNode,
					'2': defaultGainNode
				},
				{
					'1': defaultSineOscillatorNode,
					'2': {
						...defaultGainNode,
						inputs: [{ id: '1', output: 'audio', input: 'audio' }]
					}
				}
			]
		};

		expect(
			update(state, {
				type: 'ADD_CONNECTION',
				payload: {
					fromPlug: { type: 'output', nodeId: '1', id: 'audio' },
					toPlug: { type: 'input', nodeId: '2', id: 'audio' }
				}
			})
		).toEqual(expectedState);
	});

	it('removes connection between two nodes', () => {
		const state: SerializedState = {
			audioGraphHistory: [
				{
					'1': defaultSineOscillatorNode,
					'2': {
						...defaultGainNode,
						inputs: [{ id: '1', output: 'audio', input: 'audio' }]
					}
				}
			]
		};
		const expectedState: SerializedState = {
			audioGraphHistory: [
				{
					'1': defaultSineOscillatorNode,
					'2': {
						...defaultGainNode,
						inputs: [{ id: '1', output: 'audio', input: 'audio' }]
					}
				},
				{
					'1': defaultSineOscillatorNode,
					'2': defaultGainNode
				},
			]
		};

		expect(update(state, {
			type: 'REMOVE_CONNECTION',
			payload: {
				fromPlug: { type: 'output', nodeId: '1', id: 'audio' },
				toPlug: { type: 'input', nodeId: '2', id: 'audio' }
			}
		})).toEqual(expectedState);
	});
});
