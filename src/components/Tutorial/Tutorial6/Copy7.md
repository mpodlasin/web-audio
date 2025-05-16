<script>
    import Clr from '../Clr.svelte';
</script>

On top of that, when you've set the frequency of the <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to the maximum - 10000Hz, you probably noted that the peak on the <Clr nodeType="spectrum">Spectrum</Clr> node was not even in the middle of the display.

This shows that the  <Clr nodeType="spectrum">Spectrum</Clr> node can detect *extremely* high frequencies.

Why this is important will be obvious very, very soon.