<script>
    import Clr from '../Clr.svelte';
</script>

The <Clr nodeType="triangle-oscillator">Triangle</Clr> oscillator produces a slightly richer tone, making it perfect for creating a grittier techno kick.

Before we go any further, it will be useful to see the oscillator's waveform on the oscilloscope.

Create an <Clr nodeType="oscilloscope">Oscilloscope</Clr> node.

Connect the <Clr nodeType="triangle-oscillator">Triangle</Clr> node to the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node.

Reduce the frequency parameter of the <Clr nodeType="triangle-oscillator">Triangle</Clr> node to below 1 hertz.
