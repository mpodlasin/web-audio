<script>
    import Clr from '../Clr.svelte';
</script>

Now, connect the output of the <Clr nodeType="count">Count</Clr> node to the channel parameter of the <Clr nodeType="switch">Switch</Clr> node.

Also, set the input parameter of the <Clr nodeType="switch">Switch</Clr> node to 1. This is important because the <Clr nodeType="count">Count</Clr> node starts counting from 0, but we need values starting from 1 to properly select our oscillator inputs.

With this setup, each time the <Clr nodeType="clock">Clock</Clr> node sends a trigger, the <Clr nodeType="count">Count</Clr> node will increment its count and output the new value. The <Clr nodeType="switch">Switch</Clr> node will use this value to select a different oscillator, with 1 selecting the first input, 2 selecting the second input, and so on.