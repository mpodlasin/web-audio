The difference between a trigger and gate signal is just a matter of convention.

After all how short a gate signal has to be to be considered a trigger?

Beacuse of this, in `AudioCanvas` you will see all the signals of that type described as gate signals.

To further emphasize this, let's create a node that requires a "trigger-like" signal - `Sequencer`, which, as we know already, advances its sequence at every "tick" of the `Clock` node.

Create `Sequencer` node.
