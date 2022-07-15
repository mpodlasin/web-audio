import React from 'react';
import { injectableCollectOutgoingPlugsForNode } from './AudioComponentNode';
import { AggregatedPing } from './nodes/AggregatedPing';
import { AggregatedAudioParam } from './nodes/AggregatedAudioParam';
import { Ping } from './nodes/Ping';

class FrequencyStub {}
class PingStub {}

describe('AudioComponentNode', () => {

    describe('collectOutgoingPlugsForNode', () => {

        const collectOutgoingPlugsForNode = injectableCollectOutgoingPlugsForNode({
            'Oscillator': {
                component: () => React.createElement('div'),
                initialSerializableState: {},
                initializeMutableState: () => undefined,
                color: 'blue',
                inPlugs: {
                    'Frequency': {
                        type: 'number',
                        getParameter: () => new FrequencyStub() as AudioParam,
                    }
                },
                outPlugs: {},
            },
            'Sequencer': {
                component: () => React.createElement('div'),
                initialSerializableState: {},
                initializeMutableState: () => undefined,
                color: 'blue',
                inPlugs: {
                    'Ping': {
                        type: 'ping',
                        getParameter: () => new PingStub() as Ping,
                    }
                },
                outPlugs: {
                    'Frequency': {
                        type: 'number',
                    }
                },
            },
            'Button': {
                component: () => React.createElement('div'),
                initialSerializableState: {},
                initializeMutableState: () => undefined,
                color: 'blue',
                inPlugs: {},
                outPlugs: {
                    'Ping': {
                        type: 'ping',
                    }
                },
            },
        });

        it('returns empty objects when there are no edges', () => {
            const result = collectOutgoingPlugsForNode(
                {
                    name: 'Oscillator',
                    id: '123',
                    position: {top: 0, left: 0},
                },
                [],
                [],
                {}
            );

            expect(result.number).toEqual({});
            expect(result.ping).toEqual({});
        });

        it('works when there is an edge to a number plug', () => {
            const result = collectOutgoingPlugsForNode(
                {
                    name: 'Sequencer',
                    id: '123',
                    position: {top: 0, left: 0},
                },
                [
                    {
                        name: 'Oscillator',
                        id: '456',
                        position: {top: 0, left: 0},
                    }
                ],
                [
                    {
                        inNodeId: '123',
                        inPlugName: 'Frequency',
                        outNodeId: '456',
                        outPlugName: 'Frequency',
                    }
                ],
                {}
            );

            expect(result.number['Frequency'].connected).toBe(true);
            expect(result.number['Frequency'].value).toBeInstanceOf(FrequencyStub);
        });

        it('works when there is an edge to a ping plug', () => {
            const result = collectOutgoingPlugsForNode(
                {
                    name: 'Button',
                    id: '123',
                    position: {top: 0, left: 0},
                },
                [
                    {
                        name: 'Sequencer',
                        id: '456',
                        position: {top: 0, left: 0},
                    }
                ],
                [
                    {
                        inNodeId: '123',
                        inPlugName: 'Ping',
                        outNodeId: '456',
                        outPlugName: 'Ping',
                    }
                ],
                {}
            );

            expect(result.ping['Ping'].connected).toBe(true);
            expect(result.ping['Ping'].value).toBeInstanceOf(AggregatedPing);
            expect((result.ping['Ping'].value as AggregatedPing).pings[0]).toBeInstanceOf(PingStub);
        });

        it('works when there there are two edges to a ping plugs', () => {
            const result = collectOutgoingPlugsForNode(
                {
                    name: 'Button',
                    id: '123',
                    position: {top: 0, left: 0},
                },
                [
                    {
                        name: 'Sequencer',
                        id: '456',
                        position: {top: 0, left: 0},
                    },                    {
                        name: 'Sequencer',
                        id: '789',
                        position: {top: 0, left: 0},
                    }
                ],
                [
                    {
                        inNodeId: '123',
                        inPlugName: 'Ping',
                        outNodeId: '456',
                        outPlugName: 'Ping',
                    },
                    {
                        inNodeId: '123',
                        inPlugName: 'Ping',
                        outNodeId: '789',
                        outPlugName: 'Ping',
                    }
                ],
                {}
            );

            expect(result.ping['Ping'].connected).toBe(true);
            expect(result.ping['Ping'].value).toBeInstanceOf(AggregatedPing);
            expect((result.ping['Ping'].value as AggregatedPing).pings).toHaveLength(2);
        });
        
        it('works when there are two edges to number plugs', () => {
            const result = collectOutgoingPlugsForNode(
                {
                    name: 'Sequencer',
                    id: '123',
                    position: {top: 0, left: 0},
                },
                [
                    {
                        name: 'Oscillator',
                        id: '456',
                        position: {top: 0, left: 0},
                    },
                    {
                        name: 'Oscillator',
                        id: '789',
                        position: {top: 0, left: 0},
                    }
                ],
                [
                    {
                        inNodeId: '123',
                        inPlugName: 'Frequency',
                        outNodeId: '456',
                        outPlugName: 'Frequency',
                    },
                    {
                        inNodeId: '123',
                        inPlugName: 'Frequency',
                        outNodeId: '789',
                        outPlugName: 'Frequency',
                    },
                ],
                {}
            );
    
            expect(result.number['Frequency'].connected).toBe(true);
            expect(result.number['Frequency'].value).toBeInstanceOf(AggregatedAudioParam);
        });
    });
});