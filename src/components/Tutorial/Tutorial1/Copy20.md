<script>
    import Clr from '../Clr.svelte';
</script>

We want to insert `Pitch Quantizer` node between <Clr nodeType="sequencer">Sequencer</Clr> and <Clr nodeType="sine-oscillator">Sine</Clr> nodes.

In order to do that, we need to first remove line that is currently connecting <Clr nodeType="sequencer">Sequencer</Clr> and frequency parameter of the <Clr nodeType="sine-oscillator">Sine</Clr> node.

You can do that by clicking on that line and choosing `Delete` from the context menu.
