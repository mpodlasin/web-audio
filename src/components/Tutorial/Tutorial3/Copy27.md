<script>
    import Clr from '../Clr.svelte';
</script>

As you can see, the <Clr nodeType="times">×</Clr> node has two inputs - it expects two streams of numbers to multiply.

We want to multiply the <Clr nodeType="ad-envelope">AD Envelope</Clr>, but by how much?

To control that, we can use a <Clr nodeType="number">Number</Clr> node, which allows us to set a constant value.

Create a <Clr nodeType="number">Number</Clr> node and connect it to one of the inputs of the <Clr nodeType="times">×</Clr> node.
