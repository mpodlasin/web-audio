<script>
    import Clr from '../Clr.svelte';
</script>

Since <Clr nodeType="oscilloscope">Oscilloscope</Clr> shows now constantly the same number - number 0 - it gives an impression that it is not moving.

But it _does_ move to the left all the time, just as it did when we were moving the knob on the <Clr nodeType="number">Number</Clr> node.

You can validate that by nudging <Clr nodeType="number">Number</Clr> knob slightly and immediately moving back to 0.

That is what we meant previously about nodes exchanging numbers constantly - even if this is the same number.s

If the play button is on, <Clr nodeType="number">Number</Clr> node is constantly sending numbers (currently zeros) to the <Clr nodeType="oscilloscope">Oscilloscope</Clr> and <Clr nodeType="value">Value</Clr> nodes.
