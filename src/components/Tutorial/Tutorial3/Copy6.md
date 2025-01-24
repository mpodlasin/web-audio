<script>
    import Clr from '../Clr.svelte';
</script>

Let’s add a <Clr nodeType="gain">Gain</Clr> node to control the volume of our oscillator.

Insert the <Clr nodeType="gain">Gain</Clr> node between the <Clr nodeType="triangle-oscillator">Triangle</Clr> node and the <Clr nodeType="destination">Output</Clr> node.

The sound should remain the same for now, but we’ll use the <Clr nodeType="gain">Gain</Clr> node to shape the loudness in the next steps.
