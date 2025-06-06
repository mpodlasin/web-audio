<script>
    import Clr from '../Clr.svelte';
</script>

Now we'll prepare to build our own version using individual <Clr nodeType="sine-oscillator">Sine</Clr> waves.

Each <Clr nodeType="sine-oscillator">Sine</Clr> wave will represent one harmonic of the <Clr nodeType="saw-oscillator">Saw</Clr> wave.

Create a second <Clr nodeType="spectrum">Spectrum</Clr> node and connect it to the second input of the <Clr nodeType="switch">Switch</Clr> node.
