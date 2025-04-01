<script>
    import Clr from '../Clr.svelte';
</script>

One more creative variation we can try is to change the order of the oscillators.

Disconnect the oscillators from the <Clr nodeType="switch">Switch</Clr> node and reconnect them in a different order. For example:
1. <Clr nodeType="saw-oscillator">Saw</Clr> to the first input
2. <Clr nodeType="sine-oscillator">Sine</Clr> to the second input
3. <Clr nodeType="triangle-oscillator">Triangle</Clr> to the third input
4. <Clr nodeType="square-oscillator">Square</Clr> to the fourth input

Listen to how this changes the pattern of timbres in your melody.