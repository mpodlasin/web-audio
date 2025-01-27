<script>
    import Clr from '../Clr.svelte';
</script>

The <Clr nodeType="ad-envelope">AD Envelope</Clr> emits a signal in the range of `0` to `1`.

This means that when we modulate the frequency parameter on the <Clr nodeType="triangle-oscillator">Triangle</Clr> oscillator, set at 55 Hz, the frequency only varies between 55 Hz and 56 Hz - a change too small to be noticeable.
