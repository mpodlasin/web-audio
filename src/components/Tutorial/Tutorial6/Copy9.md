<script>
    import Clr from '../Clr.svelte';
</script>

Now you should see two distinct peaks on the <Clr nodeType="spectrum">Spectrum</Clr> node - one for each <Clr nodeType="sine-oscillator">Sine Oscillator</Clr>.

Try changing the frequency of the second oscillator and observe how its peak moves independently of the first peak.

This demonstrates an important capability of the <Clr nodeType="spectrum">Spectrum</Clr> node: it can display multiple frequencies simultaneously, which is essential for analyzing complex sounds.