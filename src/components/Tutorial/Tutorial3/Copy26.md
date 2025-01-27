<script>
    import Clr from '../Clr.svelte';
</script>

To make the modulation more noticeable, we need to amplify the signal coming from the <Clr nodeType="ad-envelope">AD Envelope</Clr>.

We can do this by using a <Clr nodeType="times">× (Times)</Clr> node. This node multiplies two signals (streams of numbers) together.

Create a <Clr nodeType="times">×</Clr> node, to be found in the <Clr nodeType="times">Math</Clr> section.
