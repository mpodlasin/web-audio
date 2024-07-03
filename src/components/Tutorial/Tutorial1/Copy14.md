Now the `Seqencer` and `Sine` nodes are setup correctly.

But we need one more thing.

The `Sequencer` node will not play by itself.

It requires something that would tell it (via its input) how fast it should go from one step to another - a source of tempo.

`Clock` node serves exactly that purpose - you will find it in `Clock` section.

Create `Clock` node and connect it to input of `Sequencer` node.
