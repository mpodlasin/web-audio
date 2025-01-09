<script>
    import Clr from '../Clr.svelte';
</script>

We connected <Clr nodeType="ad-envelope">AD Envelope</Clr> node to <Clr nodeType="gain">Gain</Clr> node so that <Clr nodeType="ad-envelope">AD Envelope</Clr> can control the volume of the sound.

However <Clr nodeType="ad-envelope">AD Envelope</Clr> needs to know _when_ to do that.

To stay with our guitar analogy, <Clr nodeType="ad-envelope">AD Envelope</Clr> needs to know when to pluck the string of a guitar.

Luckily we already have a perfect source for this kind of information - and that's the <Clr nodeType="clock">Clock</Clr> node.

So connect the output of the <Clr nodeType="clock">Clock</Clr> node to the input of the <Clr nodeType="ad-envelope">AD Envelope</Clr> node.
