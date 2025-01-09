<script>
    import Clr from '../Clr.svelte';
</script>

Don't trust the output of the `Oscilloscope` just yet. It is not reliable for fast changing signals.

Note also the `Value` node - the numbers displayed there change too fast to see any patterns.

Let's slow down the <Clr nodeType="sine-oscillator">Sine</Clr> oscillator _a lot_.

Reduce the frequency parameter until it's is below 0.10 Hz, like 0.09 or 0.08.
