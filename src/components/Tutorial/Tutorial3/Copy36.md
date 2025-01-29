<script>
    import Clr from '../Clr.svelte';
</script>

Since the output of the <Clr nodeType="sine-oscillator">Sine</Clr> oscillator is an audio signal in the range of `-1` to `1`, the modulation is too small for us to hear a noticeable effect.  

Normally, we would need to create another <Clr nodeType="times">×</Clr> node and another <Clr nodeType="number">Number</Clr> node to scale the modulation.
