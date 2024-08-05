Even though `Sequencer` expects a trigger signal, we see that sending gate signals of arbitrary lengths works as well.

That's because, again, the only thing that matters is a signal that jumps from 0 to 1.

So far we have seen 4 types of signals:

- number signal coming from `Number` node
- audio signal coming from `Sine` node
- trigger signal coming from `Clock` node
- gate signal coming from `Gate Length` node

Even though we can categorize them separately, in the end all of them are just streams of numbers.

Because of that we can freely mix and match them with eachother.

We can see that once more if we connect output of `Sequencer` node to the `Value` node.
