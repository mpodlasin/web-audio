<script>
    import Clr from '../Clr.svelte';
</script>

To achieve that, we'll use two new nodes:

The <Clr nodeType="switch">Switch</Clr> node, which allows us to select between different audio signals.

The <Clr nodeType="count">Count</Clr> node, which will help us to automatically choose the appropriate parameter value for the <Clr nodeType="switch">Switch</Clr> node.
