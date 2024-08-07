Place `Value` node next to `Sequencer` and observe how the two nodes change.

You can see that `Sequencer` advances to the next step when number returned from `Gate Length` jumps from 0 to 1.

Note that when number in `Value` returns from 1 to 0, this does _not_ affect the sequencer.

The length of the gate signal (that is how long the number displayed in `Value` stays being 1) does not matter either.

To make sure that's true, gradually shorten the length in `Gate Length` from above 2 seconds to below 0.10 seconds.
