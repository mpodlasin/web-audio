<script>
    import Clr from '../Clr.svelte';
</script>

Manually changing the <Clr nodeType="switch">Switch</Clr> parameter works, but it would be more interesting if the oscillator type changed automatically with each note.

To achieve this, we'll use a <Clr nodeType="clock">Clock</Clr> node to generate regular triggers and a <Clr nodeType="count">Count</Clr> node to cycle through our oscillator options.

Create a <Clr nodeType="clock">Clock</Clr> node.