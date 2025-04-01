<script>
    import Clr from '../Clr.svelte';
</script>

Let's first visualize what the <Clr nodeType="count">Count</Clr> node is outputting. Create a <Clr nodeType="value">Value</Clr> node and connect the output of the <Clr nodeType="count">Count</Clr> node to it.

Press the play button if it's not already on. You should see the Value node displaying numbers changing from 0 to 3 as the Clock sends triggers to the Count node.