You can see now how signals from `Sequencer` and `Clock` (via `Gate Length`) nodes gets combined.

When `Clock` ticks, sequencer starts sending out the value of the next step.

At the same time `Gate Length` prolongs the signal from `Clock`.

That signal is equal 1, and this gets added to frequency value from `Sequencer`.

After 1 second gate signal comes back to value 0, so `Value` shows exactly the frequency coming from `Sequencer`.

Let's say that a step you've set in `Sequencer` is equal to 600Hz.

Then, at the tick of the `Clock` you will see the number 601 (600Hz from sequencer + 1 symbolizing "gate on" from `Gate Length`).

After one second this number will change back to 600, as signal from `Gate Length` returns back to 0 after 1 second.
