<script>
    import Clr from '../Clr.svelte';
</script>

Right now, the kick has an aggressive, textured sound, but it might be a bit too harsh.

We can shape its tone further by removing some of the higher frequencies. 

To do that, we’ll use a new type of node—a <Clr nodeType="lowpass-filter">Lowpass Filter</Clr>. 

Create a <Clr nodeType="lowpass-filter">Lowpass</Clr> node, to be found in the <Clr nodeType="lowpass-filter">Filter</Clr> section of the node creation menu.
