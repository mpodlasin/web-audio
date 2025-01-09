<script>
    import Clr from '../Clr.svelte';
</script>

In future tutorials we will explain in more detail how the stream of numbers represents a sound.

For now it is only important to note that _all_ signals flowing in `AudioCanvas` - so all signals flowing in cables connecting nodes - are simply of numbers, no matter what they represent.

We will now keep driving this point home, by investigating other nodes and that we used in the previous tutorial and their outputs.

Let's start by deleting the <Clr nodeType="sine-oscillator">Sine</Clr> node.
