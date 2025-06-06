<script>
    import Clr from '../Clr.svelte';
</script>

Create a fourth <Clr nodeType="gain">Gain</Clr> node and set its gain parameter to 0.2 (which is 1/5).

Connect the fifth <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to this <Clr nodeType="gain">Gain</Clr> node, then connect the <Clr nodeType="gain">Gain</Clr> node to the second <Clr nodeType="spectrum">Spectrum</Clr> node.
