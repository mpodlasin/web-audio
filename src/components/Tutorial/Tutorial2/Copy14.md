Now (given that the play button is still on) you can see numbers fluctuating again, this time between values of 49.5 and 50.5.

As you've probably guessed, having to lines routed to the same input results in two streams of numbers being _added_ together.

We have two signals:

- a constant value of 50,
- a sine wave reduced by multiplication to a range of -0.5 to 0.5.

Since we are adding 50 to values between -0.5 and 0.5, we end up with range of 49.5 (50 - 0.5) and 50.5 (50 + 0.5).

Note that we added an audio signal, coming from `Sine` oscillator node (via `Mult`) to a number coming from `Number` node.

This again shows us that in `AudioCanvas` all signals are just streams of numbers.

To continue driving this point home, let's see the output of a `Clock` node. Create it.
