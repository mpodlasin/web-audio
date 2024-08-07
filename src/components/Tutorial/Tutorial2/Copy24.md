Even though `Sequencer` expects a trigger signal, we see that sending gate signals of arbitrary lengths works as well.

That's because, again, the only thing that matters to a `Sequencer` (or any node that expects a "trigger-like" signal) is a signal that jumps from 0 to 1.

To summarise, so far we have seen 4 types of signals:

- number signal coming from `Number` node
- audio signal coming from `Sine` node
- trigger signal coming from `Clock` node
- gate signal coming from `Gate Length` node

Even though we can categorize them as separate, in the end all of them are just streams of numbers.

Because of that we can freely mix and match them with eachother.

We can see that once again if we connect the output of `Sequencer` node to the `Value` node input, while still keeping the connection from `Gate Length`.
