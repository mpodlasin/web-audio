<script>
    import Clr from '../Clr.svelte';
</script>

The <Clr nodeType="count">Count</Clr> node counts incoming triggers and outputs the current count. It has a modulo parameter that determines when the count resets.

For example, if the modulo is set to 4, the <Clr nodeType="count">Count</Clr> node will output values 0, 1, 2, 3 in sequence, then start over. These values can be used to select different inputs on the Switch node.