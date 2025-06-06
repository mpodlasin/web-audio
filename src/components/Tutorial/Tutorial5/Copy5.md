<script>
    import Clr from '../Clr.svelte';
</script>

The <Clr nodeType="switch">Switch</Clr> node has four inputs and one output.

It works like a selector: based on the value of its channel parameter, it chooses which of its inputs to route to the output.

For example, if the channel parameter is set to 1, the signal from the first input will be sent to the output.

If it's set to 2, the signal from the second input will be sent, and so on.
