Since `Oscilloscope` shows the same number - number 0 - it gives an impression that it is not moving.

But it _does_ move constantly to the left, just as it did when we were moving the knob on the `Number` node.

You can validate that by nudging `Number` knob slightly and immediately moving back to 0.

That is what we meant previously about nodes exchanging numbers _constantly_.

If the play button is presset, `Number` node is constantly sending numbers (currently zeros) to the `Oscilloscope` and `Value` nodes.
