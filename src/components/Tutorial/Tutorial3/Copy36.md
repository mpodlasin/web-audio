<script>
    import Clr from '../Clr.svelte';
</script>

And that's it!

In this tutorial, we've learned how to make a simple but punchy techno kick.

We used the fact that signals are completely interchangeable in `AudioCanvas` by:

Controlling the <Clr nodeType="gain">Gain</Clr> node with the <Clr nodeType="saw-lfo">Saw LFO</Clr> instead of the <Clr nodeType="ad-envelope">AD Envelope</Clr>.

Using the <Clr nodeType="ad-envelope">AD Envelope</Clr> to control the frequency of the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr> instead.

Triggering the <Clr nodeType="ad-envelope">AD Envelope</Clr> with the <Clr nodeType="saw-lfo">Saw LFO</Clr> instead of a <Clr nodeType="clock">Clock</Clr>.
