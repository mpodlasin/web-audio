<script>
    import Clr from '../Clr.svelte';
</script>

Note how in the case of <Clr nodeType="sine-oscillator">Oscillator</Clr> nodes, we used the frequency parameter to control pitch.

Meanwhile, here in the case of the <Clr nodeType="saw-lfo">LFO</Clr>, we control the length of the waveform.

It turns out that these two concepts are equivalent—shortening the waveform of an oscillator makes us perceive its pitch to be higher.
