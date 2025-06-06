<script>
    import Clr from '../Clr.svelte';
</script>

Manually changing the <Clr nodeType="switch">Switch</Clr> parameter works for testing purposes, but we want the parameter to change automatically on each note.

To achieve this, we will use the already mentioned <Clr nodeType="count">Count</Clr> node to cycle through the values of the channel parameter.

Create the <Clr nodeType="count">Count</Clr> node. You will find it in the <Clr nodeType="count">Clock</Clr> section of the node creation menu.
