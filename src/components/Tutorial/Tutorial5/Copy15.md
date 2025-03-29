<script>
    import Clr from '../Clr.svelte';
</script>

Connect the <Clr nodeType="clock">Clock</Clr> node to the trigger input of the <Clr nodeType="ad-envelope">AD Envelope</Clr> node.

Then, connect the output of the <Clr nodeType="ad-envelope">AD Envelope</Clr> node to the gain parameter of the <Clr nodeType="gain">Gain</Clr> node.

Set the gain parameter itself to 0, as we want the envelope to fully control the amplitude.

Adjust the tempo parameter on the <Clr nodeType="clock">Clock</Clr> node to a setting you like. A tempo of around 50 BPM works well for this patch, but feel free to experiment with different values.