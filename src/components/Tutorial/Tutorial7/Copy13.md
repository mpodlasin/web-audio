<script>
    import Clr from '../Clr.svelte';
</script>

In Tutorial 6, we mentioned that harmonics decrease in amplitude, but we didn't explain exactly how fast.

For <Clr nodeType="saw-oscillator">Saw</Clr> waves, each harmonic's amplitude follows the _1/n rule_ - the second harmonic has 1/2 the amplitude, the third has 1/3, and so on.

Create a <Clr nodeType="gain">Gain</Clr> node and set its gain parameter to 0.5 (which is 1/2).