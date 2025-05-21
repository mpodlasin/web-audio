<script>
    import Clr from '../Clr.svelte';
</script>

On top of that, when you've set the frequency of the <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to the maximum - 10000Hz, you probably noted that the peak on the <Clr nodeType="spectrum">Spectrum</Clr> node was not even in the middle of the display.

This shows that the  <Clr nodeType="spectrum">Spectrum</Clr> node can detect *extremely* high frequencies.

In fact, if you increase the volume on the <Clr nodeType="destination">Output</Clr>, depending on your audio setup, you may not even be able to hear anything, as the human ear is not sensitive enough to hear sounds from upper frequency ranges.