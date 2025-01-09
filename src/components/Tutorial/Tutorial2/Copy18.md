<script>
    import Clr from '../Clr.svelte';
</script>

We want to insert `Gate Length` between <Clr nodeType="clock">Clock</Clr> and the two other nodes.

In order to do that, delete all the connections we have so far.

Next, connect <Clr nodeType="clock">Clock</Clr> to `Gate Length`.

Then, connect `Gate Length` to both `Value` and `Oscilloscope` nodes.
