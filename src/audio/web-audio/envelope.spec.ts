/**
 * @jest-environment jsdom
 */
import '../mocks';
import { Envelope } from "./envelope";

describe('envelope worklet', () => {
    it('can be created', () => {
        const envelope = new Envelope();
    });
});