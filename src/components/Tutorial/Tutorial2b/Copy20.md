The `Clock` node sends a "tick" signal every second.

A "tick" signal is simply a very brief moment when the `Clock` node emits number 1, separated by "rest" periods, when `Clock` emits number 0.

`Gate Length` node detects via its input that a signal changed abruptly from 0 to 1. In that moment it starts emitting number 1 for as long as its length parameter says - in our case it is half a second.

Now slowly decrease the length parameter on the `Gate Length` node until it is below 0.20 seconds, while observing the graph on the `Oscilloscope` node.
