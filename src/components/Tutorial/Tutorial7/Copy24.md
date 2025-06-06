<script>
    import Clr from '../Clr.svelte';
</script>

So far our oscillator bank just plays the same note. Let's make it more musical by adding frequency control.

Our goal is to change the fundamental frequency and have all harmonics follow automatically.

Create a <Clr nodeType="number">Number</Clr> node. You can find it in the <Clr nodeType="number">Math</Clr> section of the node creation menu.
