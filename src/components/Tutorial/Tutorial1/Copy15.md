<script>
    import Clr from '../Clr.svelte';
</script>

<Clr nodeType="sequencer">Sequencer</Clr> node is now connected to the frequency knob of the <Clr nodeType="sine-oscillator">Sine</Clr> node.

Beginning now, instead of saying "knob", we will be using the term _parameter_ of a node.

For example, since <Clr nodeType="sine-oscillator">Sine</Clr> node has two knobs, it has two parameters - a frequency parameter and a detune parameter.

<Clr nodeType="destination">Output</Clr> node has only one parameter - volume.

Meanwhile <Clr nodeType="sequencer">Sequencer</Clr> node has 8 parameters.
