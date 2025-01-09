<script>
    import Clr from '../Clr.svelte';
</script>

Now that we have our sequence ready, we would like to somehow transfer it from the <Clr nodeType="sequencer">Sequencer</Clr> to the frequency knob of the <Clr nodeType="sine-oscillator">Sine</Clr> node.

Note that <Clr nodeType="sequencer">Sequencer</Clr> node has an output on the bottom right - that's where our sequence will be coming from.

However <Clr nodeType="sine-oscillator">Sine</Clr> node does not have any inputs - just an output - so how can we control its frequency?
