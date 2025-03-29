<script>
    import Clr from '../Clr.svelte';
</script>

Connect the <Clr nodeType="clock">Clock</Clr> node to the input of the <Clr nodeType="sequencer">Sequencer</Clr> node.

This will make the <Clr nodeType="sequencer">Sequencer</Clr> advance to the next step with each tick of the <Clr nodeType="clock">Clock</Clr>.