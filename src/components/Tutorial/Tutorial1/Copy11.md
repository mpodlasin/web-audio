<script>
    import Clr from '../Clr.svelte';
</script>

<Clr nodeType="sequencer">Sequencer</Clr> node might look scary, but it actually works in a simple manner.

Each knob represents a frequency at a given moment. We call that moment a _step_.

So, when <Clr nodeType="sequencer">Sequencer</Clr> is running, emitted frequency will change from step to step - starting from step 1, finishing at step 8 and then restarting from the beginning.
