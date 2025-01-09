<script>
    import Clr from '../Clr.svelte';
</script>

We want to insert <Clr nodeType="gate-length">Gate Length</Clr> between <Clr nodeType="clock">Clock</Clr> and the two other nodes.

In order to do that, delete all the connections we have so far.

Next, connect <Clr nodeType="clock">Clock</Clr> to <Clr nodeType="gate-length">Gate Length</Clr>.

Then, connect <Clr nodeType="gate-length">Gate Length</Clr> to both <Clr nodeType="value">Value</Clr> and <Clr nodeType="oscilloscope">Oscilloscope</Clr> nodes.
