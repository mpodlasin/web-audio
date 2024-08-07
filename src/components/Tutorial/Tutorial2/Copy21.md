The difference between a trigger and gate signal is just a matter of convention.

After all how short a gate signal has to be, in order to be considered a trigger?

To further emphasize this, let's create a node that requires a trigger signal.

We can use `Sequencer` node, which on an incoming trigger signal advances to the next step in the sequence.

Create `Sequencer` node.
