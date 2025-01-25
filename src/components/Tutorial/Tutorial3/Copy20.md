<script>
    import Clr from '../Clr.svelte';
</script>

We need a trigger, but a trigger is nothing more than a sudden change from `0` to `1`.

We can see that type of change in the signal of the <Clr nodeType="saw-lfo">Saw LFO</Clr>. At the beginning of each cycle, it jumps from 0 to 1 immediately.

So, does that mean we can simply use the <Clr nodeType="saw-lfo">Saw LFO</Clr> signal as a trigger source for the <Clr nodeType="ad-envelope">AD Envelope</Clr>?

Absolutely! Connect the output of the <Clr nodeType="saw-lfo">Saw LFO</Clr> to the **trigger** input of the <Clr nodeType="ad-envelope">AD Envelope</Clr> node.
