<script>
    import Clr from '../Clr.svelte';
</script>

Create a second <Clr nodeType="gain">Gain</Clr> node and set its gain parameter to 0.33 (which is approximately 1/3).

Connect the third <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to this <Clr nodeType="gain">Gain</Clr> node, then connect the <Clr nodeType="gain">Gain</Clr> node to the second <Clr nodeType="spectrum">Spectrum</Clr> node.
