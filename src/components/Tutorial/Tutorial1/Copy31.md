<script>
    import Clr from '../Clr.svelte';
</script>

We connected `AD Envelope` node to `Gain` node so that `AD Envelope` can control the volume of the sound.

However `AD Envelope` needs to know _when_ to do that.

To stay with our guitar analogy, `AD Envelope` needs to know when to pluck the string of a guitar.

Luckily we already have a perfect source for this kind of information - and that's the <Clr nodeType="clock">Clock</Clr> node.

So connect the output of the <Clr nodeType="clock">Clock</Clr> node to the input of the `AD Envelope` node.
