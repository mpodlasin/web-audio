<script>
    import Clr from '../Clr.svelte';
</script>

And that's it!

You've built your own melody playing little synthesiser.

Feel free to play more with all the parameters that you see on the screen.

In the meantime let's recap the most important things we've learned so far:

- In `AudioCanvas` we create `nodes` and connect them together with `lines` in order to built synthesisers.
- Nodes have `inputs` (on the bottom lefft) and `outputs` (on the bottom right) that look like little circles.
- Nodes have also `parameters` in the form of `knobs`, which values can be changed with the mouse.
- Not only we can control parameters manually, but we can also control them with other nodes by connecting a node and a knob with a line.
