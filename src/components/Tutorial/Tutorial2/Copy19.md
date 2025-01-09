<script>
    import Clr from '../Clr.svelte';
</script>

Now we see that the <Clr nodeType="value">Value</Clr> node displays the number 1 constantly.

Graph on the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node is always in its "up" position.

This makes sense, since we said that <Clr nodeType="gate-length">Gate Length</Clr> will prolong the time that the number 1 is emitted by the clock.

Since the <Clr nodeType="clock">Clock</Clr> node emits number 1 every second and <Clr nodeType="gate-length">Gate Length</Clr> stretches that time to 1 second also, in effect we see number 1 being emitted constantly.
