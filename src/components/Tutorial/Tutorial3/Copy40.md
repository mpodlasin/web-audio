<script>
    import Clr from '../Clr.svelte';
</script>

This sounds quite interesting now, but you may have noticed that the kick has lost a lot of its punch.

To bring it back, we’ll use the envelope signal from the <Clr nodeType="ad-envelope">AD Envelope</Clr>.

Since we’re already amplifying this signal using the <Clr nodeType="times">×</Clr> node, we can simply reuse its output.

Connect the output of the <Clr nodeType="times">×</Clr> node to the frequency parameter of the <Clr nodeType="sine-oscillator">Sine</Clr> oscillator.
