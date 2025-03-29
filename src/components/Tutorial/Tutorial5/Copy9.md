<script>
    import Clr from '../Clr.svelte';
</script>

Now, create a <Clr nodeType="count">Count</Clr> node. You can find it in the <Clr nodeType="count">Clock</Clr> section.

The <Clr nodeType="count">Count</Clr> node counts incoming triggers and outputs the current count. It has a modulo parameter that determines when the count resets.

For example, if the modulo is set to 4, the <Clr nodeType="count">Count</Clr> node will output values that we can use to select different inputs on the Switch node.