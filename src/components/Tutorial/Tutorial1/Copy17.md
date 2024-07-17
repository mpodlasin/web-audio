Now connect `Sequencer` node to `Pitch Quantizer`.

And then connect `Pitch Quantizer` to frequency parameter of `Sine` node, just as you did before.

This way signal flows from `Sequencer` to `Pitch Quantizer`, which adjusts frequency being sent to its input to fit a standard western musical scale, before sending adjusted frequency further to the parameter of `Sine` node.
