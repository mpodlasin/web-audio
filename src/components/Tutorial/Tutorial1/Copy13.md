<script>
    import Clr from '../Clr.svelte';
</script>

Now that we have our sequence ready, we want to transfer it from the <Clr nodeType="sequencer">Sequencer</Clr> to the frequency knob of the <Clr nodeType="sine-oscillator">Sine</Clr> node.

Notice that the <Clr nodeType="sequencer">Sequencer</Clr> node has an output on the bottom right - that's where our sequence will come from.

However, the <Clr nodeType="sine-oscillator">Sine</Clr> node does not have any inputs, so how can we control its frequency?
