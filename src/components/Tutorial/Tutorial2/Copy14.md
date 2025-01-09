<script>
    import Clr from '../Clr.svelte';
</script>

Create a <Clr nodeType="clock">Clock</Clr> node and connect it to both <Clr nodeType="value">Value</Clr> and <Clr nodeType="oscilloscope">Oscilloscope</Clr> nodes.

Now reduce the tempo parameter to be _exactly_ 15 BPM.

Most likely you won't be able to do it by dragging the knob with your mouse.

You can however click on the value (120 BPM) displayed under the knob, enter the value with the keyboard and then press enter.

Setting the <Clr nodeType="clock">Clock</Clr> node to 15 BPM means that the clock will "tick" exactly once per second.
