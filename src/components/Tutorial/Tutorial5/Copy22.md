<script>
    import Clr from '../Clr.svelte';
</script>

This sounds better, but is still a bit static. That's because we are playing the same note on each trigger from the <Clr nodeType="clock">Clock</Clr> node.

Let's add a <Clr nodeType="sequencer">Sequencer</Clr> and a <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr> node in order to create a melody.