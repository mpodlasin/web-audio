<script>
    import Clr from '../Clr.svelte';
</script>

Now that we can see what the <Clr nodeType="count">Count</Clr> node is outputting, let's connect it to control our <Clr nodeType="switch">Switch</Clr> node.

Connect the output of the <Clr nodeType="count">Count</Clr> node to the channel parameter of the <Clr nodeType="switch">Switch</Clr> node.

Also, set the input parameter of the <Clr nodeType="switch">Switch</Clr> node to 1. This is important because we want to cover all four oscillators. The <Clr nodeType="count">Count</Clr> node outputs values 0-3, but we need values 1-4 to select our oscillator inputs.

With this setup, each time the <Clr nodeType="clock">Clock</Clr> node sends a trigger, the <Clr nodeType="count">Count</Clr> node will increment its count and output the new value. The <Clr nodeType="switch">Switch</Clr> node will use this value (plus the input parameter value of 1) to select a different oscillator, with 1 selecting the first input, 2 selecting the second input, and so on.