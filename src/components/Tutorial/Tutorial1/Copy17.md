<script>
    import Clr from '../Clr.svelte';
</script>

Now the `Seqencer` and <Clr nodeType="sine-oscillator">Sine</Clr> nodes are setup correctly.

But we need one more thing.

The <Clr nodeType="sequencer">Sequencer</Clr> node will not play by itself.

It requires something that would tell it (via its input) how fast it should go from one step to another - a source of a tempo.

<Clr nodeType="clock">Clock</Clr> node serves exactly that purpose - you will find it in <Clr nodeType="clock">Clock</Clr> section.

Create <Clr nodeType="clock">Clock</Clr> node and connect it to input of <Clr nodeType="sequencer">Sequencer</Clr> node.
