<script>
    import Clr from '../Clr.svelte';
</script>

Before we can use the <Clr nodeType="saw-lfo">Saw LFO</Clr> to control the volume, there’s something we need to adjust.

By default, the <Clr nodeType="saw-lfo">Saw LFO</Clr> outputs a signal in the range of `-1` to `1`.

However, the <Clr nodeType="gain">Gain</Clr> node expects a value in the range of `0` to `1`.

To fix this, enable the unipolar option on the <Clr nodeType="saw-lfo">Saw LFO</Clr> by clicking the button with the "unipolar" label.
