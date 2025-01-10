<script>
    import Clr from '../Clr.svelte';
</script>

The <Clr nodeType="sequencer">Sequencer</Clr> node might look scary, but it actually works in a simple way.

Each knob represents a frequency at a given moment, which we call a _step_.

When the <Clr nodeType="sequencer">Sequencer</Clr> is running, the emitted frequency changes from step to step - starting from step 1, finishing at step 8, and then restarting from the beginning.
