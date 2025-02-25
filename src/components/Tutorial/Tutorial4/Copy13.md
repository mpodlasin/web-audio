<script>
    import Clr from '../Clr.svelte';
</script>

Since Hertz measures cycles per second, setting the frequency to `0.5` Hz tells the <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to complete half a cycle per second.

This means it takes two seconds to complete a full cycle.

So, at `0.5` Hz, the oscillator moves twice as slow as at `1` Hz and four times slower than at `2` Hz.

And that's exactly what we see on the <Clr nodeType="oscilloscope">Oscilloscope</Clr>.
