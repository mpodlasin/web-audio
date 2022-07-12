import { collectOutgoingPlugsForNode } from './AudioComponentNode';

describe('AudioComponentNode', () => {

    describe('collectOutgoingPlugsForNode', () => {

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
            expect(result.number['Frequency'].value).toBeDefined();
        });
    });
});