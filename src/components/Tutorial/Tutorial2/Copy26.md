<script>
    import Clr from '../Clr.svelte';
</script>

`AD Envelope` node needs a trigger signal in order to function, that's why we have left the <Clr nodeType="clock">Clock</Clr> node.

Connect <Clr nodeType="clock">Clock</Clr> node to `AD Envelope`.

Then connect `AD Envelope` to `Value` and `Oscilloscope` nodes.
