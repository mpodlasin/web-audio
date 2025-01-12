<script>
    import Clr from '../Clr.svelte';
</script>

The easiest way to learn what is happening under the hood of `AudioCanvas` is with the two following nodes:

The <Clr nodeType="number">Number</Clr> node which simply emits a number that is set on its knob. You can find the <Clr nodeType="number">Number</Clr> node in the <Clr nodeType="number">Math</Clr> section.

The <Clr nodeType="value">Value</Clr> node which displays whatever signal is being sent to it via its input. You can find the <Clr nodeType="value">Value</Clr> node in the <Clr nodeType="value">Visualisation</Clr> section.

Create both of those nodes and connect them together.
