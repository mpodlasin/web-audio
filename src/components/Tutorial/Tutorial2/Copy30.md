<script>
    import Clr from '../Clr.svelte';
</script>

We see on the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node that the shape of the envelope changed.

Now the attack phase of the envelope is more of a buildup rather than immediate jump to value 1.

That being said we see that the range of numbers emitted from the <Clr nodeType="ad-envelope">AD Envelope</Clr> is unchanged. Meaning that we are still dealing with numbers from 0 to 1.
