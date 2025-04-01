<script>
    import Clr from '../Clr.svelte';
</script>

Let's add some reverb to make our sound more polished.

Create a <Clr nodeType="convolution">Convolution</Clr> node from the <Clr nodeType="convolution">Effect</Clr> section.

Insert it between the <Clr nodeType="gain">Gain</Clr> node and the <Clr nodeType="destination">Output</Clr> node.