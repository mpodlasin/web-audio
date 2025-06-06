<script>
    import Clr from '../Clr.svelte';
</script>

Create a third <Clr nodeType="gain">Gain</Clr> node and set its gain parameter to 0.25 (which is 1/4).

Connect the fourth <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to this <Clr nodeType="gain">Gain</Clr> node, then connect the <Clr nodeType="gain">Gain</Clr> node to the second <Clr nodeType="spectrum">Spectrum</Clr> node.
