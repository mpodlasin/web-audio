Great. Now `Sequencer` node is connected to frequency parameter of `Sine` node.

You have to be aware that when connecting a node to parameter, what happens is that signal from the cable is _added_ to value set by the parameter knob.

This means that if we want to _only_ use values from the sequencer, we should reduce value of frequency knob to 0Hz.

Drag the frequency knob to 0, just as you would do it with regular, unconnected knob.
