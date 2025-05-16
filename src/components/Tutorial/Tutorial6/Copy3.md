<script>
    import Clr from '../Clr.svelte';
</script>

Let's set up a basic patch to see how the <Clr nodeType="spectrum">Spectrum</Clr> node works.

Create a <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> and a <Clr nodeType="gain">Gain</Clr> node.

Connect the <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to the <Clr nodeType="gain">Gain</Clr> node, and then connect the <Clr nodeType="gain">Gain</Clr> node to the <Clr nodeType="spectrum">Spectrum</Clr> node.