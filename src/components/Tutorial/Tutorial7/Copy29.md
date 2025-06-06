<script>
    import Clr from '../Clr.svelte';
</script>

Connect each harmonic <Clr nodeType="number">Number</Clr> node to the first input of its corresponding <Clr nodeType="times">Times</Clr> node.

Then connect the main frequency <Clr nodeType="number">Number</Clr> node (set to 440) to the second input of each <Clr nodeType="times">Times</Clr> node.
