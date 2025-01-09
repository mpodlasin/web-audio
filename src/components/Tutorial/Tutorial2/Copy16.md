<script>
    import Clr from '../Clr.svelte';
</script>

Every second however, the <Clr nodeType="clock">Clock</Clr> node emits the number 1 for an extremely brief moment.

This moment is so brief that you _might_ see only a brief flicker when looking at the number displayed by the <Clr nodeType="value">Value</Clr> node.

This moment is also so brief that, depending on the device you are using, the <Clr nodeType="oscilloscope">Oscilloscope</Clr> may not even catch it!

If it does, it shows a vertical line, signifying sudden jump to the value 1.
