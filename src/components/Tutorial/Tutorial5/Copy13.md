<script>
    import Clr from '../Clr.svelte';
</script>

You probably noticed that when you slowed the tempo down, the numbers displayed in the <Clr nodeType="value">Value</Clr> node also started cycling slower.

When the <Clr nodeType="count">Count</Clr> node receives a trigger via its input, it increases a number emitted on its output by one.

The count starts at 0 and ends at 7, because we have set the modulo parameter to 8.

Set the modulo parameter to 4 and see what happens.
