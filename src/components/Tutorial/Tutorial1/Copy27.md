<script>
    import Clr from '../Clr.svelte';
</script>

We said that we want to control the loudness of the sound (like a dimnishing loudness of a guitar string).

We could control the volume parameter on the <Clr nodeType="destination">Output</Clr> node, but we want to leave it for controling overall loudness.

Instead, let's use a dedicated node which allows us to control the volume of a sound - `Gain` node, to be found in the `Gain` section of the node creation menu.

Create `Gain` node.
