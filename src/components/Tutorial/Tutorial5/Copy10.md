<script>
    import Clr from '../Clr.svelte';
</script>

The <Clr nodeType="count">Count</Clr> node requires a trigger signal as its input, so we will also use the good old <Clr nodeType="clock">Clock</Clr> node.

Create a <Clr nodeType="clock">Clock</Clr> node and connect its output to the input of the <Clr nodeType="count">Count</Clr> node.
