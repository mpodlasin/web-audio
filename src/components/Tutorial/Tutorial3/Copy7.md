<script>
    import Clr from '../Clr.svelte';
</script>

We now want to control the volume of the oscillator.

In previous tutorials, we used an <Clr nodeType="ad-envelope">AD Envelope</Clr> for this. This time, we’ll take a different approach.

For variety, and to show that different signal types can achieve the same result, we’ll use a new node type: the <Clr nodeType="saw-lfo">LFO</Clr>.
