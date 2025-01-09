<script>
    import Clr from '../Clr.svelte';
</script>

We said that `AD Envelope` emulates plucking a guitar string.

When the pluck happens, at the beginning the sound is the loudest and then it gradually becomes quieter and quieter.

That's exactly what we are seeing on the `Oscilloscope`, where numbers emitted from `AD Envelope` suddenly jump to 1 and then gradually decrease until they reach 0, over the span of half a second.

This happens in reaction to trigger signal from the <Clr nodeType="clock">Clock</Clr> node, which happens every second.
