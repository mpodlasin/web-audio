<script>
    import Clr from '../Clr.svelte';
</script>

Now let’s complete the setup.

Disconnect the output of the <Clr nodeType="ad-envelope">AD Envelope</Clr> from the <Clr nodeType="triangle-oscillator">Triangle</Clr> node.

Connect the output of the <Clr nodeType="ad-envelope">AD Envelope</Clr> to one of the inputs of the <Clr nodeType="times">×</Clr> node.

Connect the output of the <Clr nodeType="times">×</Clr> node to the frequency parameter of the <Clr nodeType="triangle-oscillator">Triangle</Clr> node.
