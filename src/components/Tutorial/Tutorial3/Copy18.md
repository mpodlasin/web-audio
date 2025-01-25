<script>
    import Clr from '../Clr.svelte';
</script>

Now that we’ve added rhythm to the kick, you might notice it’s missing a bit of punch in its tone.

To give the kick that characteristic "thump," we’ll create a quick pitch drop at the start of each cycle. For this, we’ll use an <Clr nodeType="ad-envelope">AD Envelope</Clr>.

Create an <Clr nodeType="ad-envelope">AD Envelope</Clr> node.
