/**
 * @jest-environment jsdom
 */
import '../../mocks';
import { CustomSineOscillatorNode, type AudioNodeDatabase } from "../../initialized";
import { update } from "./update";

describe('initialized/update', () => {
    it('creates new node', () => {
        const audioNodeDatabase: AudioNodeDatabase = {};
        
        update(audioNodeDatabase, { type: "CREATE_NODE", payload: { nodeId: '1', nodeType: 'sine-oscillator', position: {x: 0, y: 0}}});

        expect(audioNodeDatabase['1']).toBeDefined();
        expect(audioNodeDatabase['1']).toBeInstanceOf(CustomSineOscillatorNode);
    });
});