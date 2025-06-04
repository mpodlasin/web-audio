<script>
    import Clr from '../Clr.svelte';
</script>

Create a fifth <Clr nodeType="gain">Gain</Clr> node and set its gain parameter to 0.167 (which is approximately 1/6).

Connect the sixth <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to this <Clr nodeType="gain">Gain</Clr> node, then connect the <Clr nodeType="gain">Gain</Clr> node to the second <Clr nodeType="spectrum">Spectrum</Clr> node.