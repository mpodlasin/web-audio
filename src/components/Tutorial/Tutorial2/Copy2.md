<script>
    import Clr from '../Clr.svelte';
</script>

The easiest way to visualize what is happening under the hood of `AudioCanvas` is with the two following nodes:

<Clr nodeType="number">Number</Clr> node which simply emits a number that is set on its knob. You can find <Clr nodeType="number">Number</Clr> node in <Clr nodeType="number">Math</Clr> section.

<Clr nodeType="value">Value</Clr> node which displays whatever signal is being sent to it via its input. You can find <Clr nodeType="value">Value</Clr> node in <Clr nodeType="value">Visualisation</Clr> section.

Create both of those nodes and connect them together.
