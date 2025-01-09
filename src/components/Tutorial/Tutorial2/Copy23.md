<script>
    import Clr from '../Clr.svelte';
</script>

The state where number 1 is being emitted is called a _gate_ and overall this kind of binary, on/off signal is called a gate signal.

So we can say that `Gate Length` node emits gates of specified length.

On the other hand, if the length of the gate is irrelevant, or if the gate is extremely short, we call it a _trigger_ signal, since it is usually used to trigger some action.

So we can say that <Clr nodeType="clock">Clock</Clr> node emits triggers.
