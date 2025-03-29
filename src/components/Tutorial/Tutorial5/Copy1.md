<script>
    import Clr from '../Clr.svelte';
</script>

Welcome to the fifth chapter of the `AudioCanvas` tutorial!

In Tutorial 4, we explored the four standard oscillator types: <Clr nodeType="sine-oscillator">Sine</Clr>, <Clr nodeType="triangle-oscillator">Triangle</Clr>, <Clr nodeType="square-oscillator">Square</Clr>, and <Clr nodeType="saw-oscillator">Saw</Clr>, each with its own distinct sound character.

Today, we'll build on that knowledge to create something more dynamic: a voice that changes its oscillator type with each note, automatically cycling through the different timbres.

To accomplish this, we'll use two new nodes: the <Clr nodeType="switch">Switch</Clr> node, which allows us to select between different audio sources, and the <Clr nodeType="count">Count</Clr> node, which helps us cycle through options automatically.