<script>
    import Clr from '../Clr.svelte';
</script>

Now that the <Clr nodeType="sine-oscillator">Sine</Clr> oscillator is connected to the <Clr nodeType="destination">Output</Clr> node, an audio signal can flow between them.

All nodes in `AudioCanvas` have signal inputs and/or outputs - depending on their function.

Inputs are always on the left of a node - as it is the case for the <Clr nodeType="destination">Output</Clr> node.

Outputs are always on the right - as it is the case for the <Clr nodeType="sine-oscillator">Sine</Clr> node.
