<script>
    import Clr from '../Clr.svelte';
</script>

Congratulations! You've created a dynamic patch that cycles through different oscillator types with each note.

In this tutorial, we've learned:

- How to use the <Clr nodeType="switch">Switch</Clr> node to select between different audio sources
- How to use the <Clr nodeType="count">Count</Clr> node to create cycling patterns
- How the Count node's values (0-3) map to the Switch node's inputs (1-4)
- How to combine these techniques with sequencing to create a melody that changes timbre with each note
