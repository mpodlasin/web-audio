<script>
    import Clr from '../Clr.svelte';
</script>

We can do that by trying something unusual.

So far, we’ve modulated the frequency of the <Clr nodeType="triangle-oscillator">Triangle</Clr> oscillator by multiplying it with the signal from the <Clr nodeType="ad-envelope">AD Envelope</Clr> node.

But what would happen if we also modulated it using a signal from... another oscillator?
