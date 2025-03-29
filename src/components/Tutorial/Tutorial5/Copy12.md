<script>
    import Clr from '../Clr.svelte';
</script>

Let's understand how the <Clr nodeType="count">Count</Clr> node and <Clr nodeType="switch">Switch</Clr> node work together:

The <Clr nodeType="count">Count</Clr> node with modulo 4 counts from 0 to 3, incrementing each time it receives a trigger from the <Clr nodeType="clock">Clock</Clr> node. The sequence is: 0, 1, 2, 3, 0, 1, 2, 3, and so on.

The <Clr nodeType="switch">Switch</Clr> node's channel parameter expects values from 1 to 4 to select between its four inputs. By setting the input parameter to 1 and adding the <Clr nodeType="count">Count</Clr> node's output (0-3), we get values from 1 to 4:

- Count outputs 0 + input value 1 = Switch selects input 1
- Count outputs 1 + input value 1 = Switch selects input 2
- Count outputs 2 + input value 1 = Switch selects input 3
- Count outputs 3 + input value 1 = Switch selects input 4

This way, we cycle through all four oscillator types automatically.