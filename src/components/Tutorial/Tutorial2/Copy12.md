<script>
    import Clr from '../Clr.svelte';
</script>

This shows us that the <Clr nodeType="number">Number</Clr> node, which simply emits numbers, and the <Clr nodeType="sine-oscillator">Sine</Clr> node, which outputs audio signal, aren't that different from eachother after all.

That's because on the computer, an audio signal is stored and processed as precisely what we've seen - a stream of numbers.

Usually those numbers are in the -1 and 1 range, as it is the case here.
