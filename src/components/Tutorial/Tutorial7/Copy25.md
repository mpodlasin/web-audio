<script>
    import Clr from '../Clr.svelte';
</script>

Set the value parameter on the <Clr nodeType="number">Number</Clr> node to 440.

Connect the <Clr nodeType="number">Number</Clr> node output to the frequency parameter of the first <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> (our fundamental).

Then set the frequency parameter on that <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to 0.