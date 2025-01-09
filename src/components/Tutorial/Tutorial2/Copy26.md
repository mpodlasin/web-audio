<script>
    import Clr from '../Clr.svelte';
</script>

<Clr nodeType="ad-envelope">AD Envelope</Clr> node needs a trigger signal in order to function, that's why we have left the <Clr nodeType="clock">Clock</Clr> node.

Connect <Clr nodeType="clock">Clock</Clr> node to <Clr nodeType="ad-envelope">AD Envelope</Clr>.

Then connect <Clr nodeType="ad-envelope">AD Envelope</Clr> to <Clr nodeType="value">Value</Clr> and <Clr nodeType="oscilloscope">Oscilloscope</Clr> nodes.
