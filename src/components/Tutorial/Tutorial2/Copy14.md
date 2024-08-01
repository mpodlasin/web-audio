Now (given that play button is still on) you can see numbers fluctuating again, but now between values of 49.5 and 50.5.

As you've probably guessed, having to lines routed to the same input results in two streams of numbers being _added_ together.

Since we are adding 50 to a sine wave of values between -0.5 and 0.5, we end up with range of 49.5 (50 - 0.5) and 50 (50 + 0.5).

Note that we added an audio signal, coming from `Sine` oscillator node to a simple number coming from `Number` node.

This again emphasises that in `AudioCanvas` all signals are just streams of numbers.

To continue driving on this point, let's see the output of `Clock` node. Create it.
