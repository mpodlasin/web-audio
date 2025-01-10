<script>
    import Clr from '../Clr.svelte';
</script>

The next thing that we might want to change is the fact that we hear the <Clr nodeType="sine-oscillator">Sine</Clr> oscillator constantly, not leaving any breathing room.

For example when you pluck a guitar string, it vibrates but then slows down over time, making the sound quieter and quieter until it completely ends.

We can simulate that by using an <Clr nodeType="ad-envelope">AD</Clr> envelope node, that you can find in <Clr nodeType="ad-envelope">Envelope</Clr> section.

Create it.
