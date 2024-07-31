You can now see that the numbers flowing from `Sine` oscillator get limited again, just as it was the case with `Gain` node.

`Mult` and `Gain` nodes are in fact functionally the same, with only diference being their parameters.

`Gain` knob is limited to value from 0 to 1, just so that it is easier to use it as a volume limiter.

Meanwhile `Mult` node has a larger range of numbers avaiable on the knob, to serve broader, less specific purposes.

This example further emphasises the point we are trying to make:

All signals in `AudioCanvas` are just streams of numbers.

Before we see more examples of signals, let's connect `Number` node to `Value` node as well.

At the end you should see _two_ lines going into `Value` node - one from `Number` node and one from `Mult` node.
