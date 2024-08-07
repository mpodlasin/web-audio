You can now see that the numbers flowing from `Sine` oscillator get limited again, just as it was the case with `Gain` node.

`Mult` and `Gain` nodes are in fact functionally the same, with only diferences being purely user interface related.

Knob on `Gain` node is limited to the range of 0 to 1, so that it is easier using it to reduce the volume of a sound.

Meanwhile knob on `Mult` node has a larger range of numbers available, in order to serve more board purposes.

What we have shown so far, emphasizes the point we are trying to make:

All signals in `AudioCanvas` are just streams of numbers.

The most important consequence of that is that we can mix signals of (seemingly) different kinds together.

Let's connect `Number` node to `Value` node as well, while keeping the connection from `Sine` via `Mult`.

So at the end you should see _two_ lines going into `Value` nodes input - one from `Number` node and one from `Mult` node.
