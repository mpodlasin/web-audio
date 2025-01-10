<script>
    import Clr from '../Clr.svelte';
</script>

Even though the melody is nice, the sound itself if still weirdly dry and artificial.

We can quickly fix that, by adding a reverb effect.

You can do that by using <Clr nodeType="convolution">Convolution</Clr> node, to be found in <Clr nodeType="convolution">Effect</Clr> section.

Create it and add it between <Clr nodeType="sine-oscillator">Sine</Clr> and <Clr nodeType="destination">Output</Clr> nodes.

_(Note that in order to do that, you will first have to remove the line currently connecting <Clr nodeType="sine-oscillator">Sine</Clr> with <Clr nodeType="destination">Output</Clr>. Don't be scared to do that while the play button is on, to see how it will affect the sound.)_