<script>
    import Clr from '../Clr.svelte';
</script>

As you decreased the knob, you saw how the graph displayed in the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node was in the "up" position for shorter and shorter periods of time.

Now, in each cycle, graph is up for 1/4th of the period and in the middle for 3/4th of the period - that's because we've set <Clr nodeType="gate-length">Gate Length</Clr> parameter to quarter of a second.
