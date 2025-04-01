<script>
    import Clr from '../Clr.svelte';
</script>

Connect the output of the <Clr nodeType="sequencer">Sequencer</Clr> to the input of the <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr>.

Then, connect the output of the <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr> to the frequency parameter of each oscillator: <Clr nodeType="sine-oscillator">Sine</Clr>, <Clr nodeType="triangle-oscillator">Triangle</Clr>, <Clr nodeType="square-oscillator">Square</Clr>, and <Clr nodeType="saw-oscillator">Saw</Clr>.