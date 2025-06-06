<script>
    import Clr from '../Clr.svelte';
</script>

Press the play button and slowly increase the volume on the <Clr nodeType="destination">Output</Clr> node.

You should hear the sound of the <Clr nodeType="sine-oscillator">Sine</Clr> oscillator, since the channel parameter of the <Clr nodeType="switch">Switch</Clr> node is set to 1 by default.

Try changing the channel parameter on the <Clr nodeType="switch">Switch</Clr> node to 2, 3, and 4 to hear the different oscillator types.
