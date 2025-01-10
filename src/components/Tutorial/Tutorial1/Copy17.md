<script>
    import Clr from '../Clr.svelte';
</script>

Now the `Sequencer` and <Clr nodeType="sine-oscillator">Sine</Clr> nodes are set up correctly.

But we need one more thing.

The <Clr nodeType="sequencer">Sequencer</Clr> node will not play by itself.

It requires something to tell it (via its input) how fast it should go from one step to another – a source of tempo.

The <Clr nodeType="clock">Clock</Clr> node serves exactly that purpose. You will find it in the <Clr nodeType="clock">Clock</Clr> section.

Create a <Clr nodeType="clock">Clock</Clr> node and connect it to the input of the <Clr nodeType="sequencer">Sequencer</Clr> node.
