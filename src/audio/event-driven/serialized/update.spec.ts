/**
 * @jest-environment jsdom
 */
import { update, type SerializedState } from "./update";

describe('serialized/update', () => {
    it('adds a new node', () => {
        const state: SerializedState = {
            audioGraphHistory: [{}]
        }
        const expectedState: SerializedState = {
            audioGraphHistory: [{}, {
            '1': {
                type: 'sine-oscillator',
                inputs: [],
                parameters: {
                    frequency: {
                        base: 440,
                        inputs: []
                    },
                    detune: {
                        base: 0,
                        inputs: []
                    }
                },
                ui: {
                    position: {
                        x: 1,
                        y: 2,
                    },
                    primmaryColor: '#45c7ff'
                }
            }
        }]
    };

        expect(update(state, { type: "CREATE_NODE", payload: { nodeType: 'sine-oscillator', position: { x: 1, y: 2 } } })).toEqual(expectedState);
    });

    it('removes a node', () => {
        const state: SerializedState = {
            audioGraphHistory: [{
                '1': {
                    type: 'sine-oscillator',
                    inputs: [],
                    parameters: {
                        frequency: {
                            base: 440,
                            inputs: []
                        },
                        detune: {
                            base: 0,
                            inputs: []
                        }
                    },
                    ui: {
                        position: {
                            x: 1,
                            y: 2,
                        },
                        primmaryColor: '#45c7ff'
                    }
                }
            }]
        }
        const expectedState: SerializedState = {
            audioGraphHistory: [{
                '1': {
                    type: 'sine-oscillator',
                    inputs: [],
                    parameters: {
                        frequency: {
                            base: 440,
                            inputs: []
                        },
                        detune: {
                            base: 0,
                            inputs: []
                        }
                    },
                    ui: {
                        position: {
                            x: 1,
                            y: 2,
                        },
                        primmaryColor: '#45c7ff'
                    }
                }
            }, {}]
        }

        expect(update(state, { type: 'DELETE_NODE', payload: { nodeId: '1' } })).toEqual(expectedState);
    });
});