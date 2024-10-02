`Sequencer` node is now connected to the frequency knob of the `Sine` node.

Beginning now, instead of saying "knob", we will be using the term _parameter_ of a node.

Since `Sine` node has two knobs, it has two parameters - a frequency parameter and a detune parameter.

You have to be aware that when connecting a node output to a parameter, what happens is that output signal is _added_ to the value set by the parameter knob.

This means that if we want to use values _only_ from the sequencer, we should reduce the value of the frequency parameter of `Sine` node to 0 Hz.

Drag the frequency knob on the `Sine` node down until it points to 0.
