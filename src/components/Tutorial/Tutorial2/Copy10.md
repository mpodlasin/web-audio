<script>
    import Clr from '../Clr.svelte';
</script>

Don't trust the output of the <Clr nodeType="oscilloscope">Oscilloscope</Clr> just yet. It is not reliable for fast changing signals.

Note also the <Clr nodeType="value">Value</Clr> node - the numbers displayed there change too fast to see any patterns.

Let's slow down the <Clr nodeType="sine-oscillator">Sine</Clr> oscillator _a lot_.

Reduce the frequency parameter until it's is below 0.10 Hz, like 0.09 or 0.08.
