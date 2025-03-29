<script>
    import Clr from '../Clr.svelte';
</script>

Now, let's create a <Clr nodeType="gain">Gain</Clr> node and connect the output of the <Clr nodeType="switch">Switch</Clr> node to it.

Then, create an <Clr nodeType="destination">Output</Clr> node and connect the <Clr nodeType="gain">Gain</Clr> node to it.