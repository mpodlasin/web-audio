Look at the `Value` node for a while and observe how signals from `Sequencer` and `Gate Length` nodes get combined.

Let's say that a certain step you've set in `Sequencer` is equal to 600 Hz.

When `Clock` ticks (that is changes its value from 0 to 1 for a brief moment), `Sequencer` starts sending out number 600.

At the same time `Gate Length` makes the "on" signal from `Clock` longer - it emits number 1.

Those two numbers get added because we connected two lines to the same input, so we see 601 displayed in `Value` node.

After 1 second the gate signal from `Gate Length` returns to value 0, so a number displayed in `Value` changes to 600.

After that `Clock` ticks again and the whole cycle starts again, but with a new `Sequencer` step.
