<script>
    import Clr from '../Clr.svelte';
</script>

To make the <Clr nodeType="ad-envelope">AD Envelope</Clr> work, we need a trigger signal of some sort.

Previously, we used the <Clr nodeType="clock">Clock</Clr> node for that purpose.

However, now we want to keep the <Clr nodeType="ad-envelope">AD Envelope</Clr> completely in sync with the <Clr nodeType="saw-lfo">Saw LFO</Clr>.

So what can we do?
