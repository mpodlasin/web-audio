<script>
    import Clr from '../Clr.svelte';
</script>

Now connect the output of the <Clr nodeType="sequencer">Sequencer</Clr> node to the input of the <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr> node.

Next connect the output of the <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr> to the frequency parameter of <Clr nodeType="sine-oscillator">Sine</Clr> node.
