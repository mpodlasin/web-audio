<script>
    import Clr from '../Clr.svelte';
</script>

As you’ve heard, by controlling the frequency, we can control what we would call the "pitch" of the sound.

Indeed, by properly changing the frequency over time, we can play actual melodies.

But we don’t want to do this by hand (or rather, "by mouse"), as that would be both difficult and tiring.

Instead, we can use a <Clr nodeType="sequencer">Sequencer</Clr> node, which will do it for us.

Create a <Clr nodeType="sequencer">Sequencer</Clr> node - it can be found in the <Clr nodeType="sequencer">Pitch</Clr> section of the node creation menu.
