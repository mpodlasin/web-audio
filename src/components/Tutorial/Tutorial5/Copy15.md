<script>
    import Clr from '../Clr.svelte';
</script>

Now direct your attention towards the <Clr nodeType="switch">Switch</Clr> node.

Note that the channel parameter there has values in the range from 1 to 4.

This means, that if we set it to 1 and then connect the output of the <Clr nodeType="count">Count</Clr> node to it (going from 0 to 3), we will cycle through all 4 possible values this parameter has.

This way, on each trigger coming from the <Clr nodeType="clock">Clock</Clr> node, we will hear a different oscillator, just as we wanted.