We can also see that, even though `Sequencer` emits frequencies, with a unit of Hz, this signal is still just a stream of numbers.

When numbers outputed by nodes have units, those units are simply a help for user to better understand the output of the node.

However no unit information in the actual signal - again, signals are just streams of numbers.

So we could perfectly fine use numbers from `Sequencer` to control some parameter with different units than hertz, or with no units at all.

We will see a case like that that in the next tutorial, where we will use what we learned today, but on a more musical example.
