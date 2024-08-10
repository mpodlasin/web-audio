Let's summarise what we have learned so far.

In `AudioCanvas` all signals that flow between nodes are streams of numbers that can change over time.

Some nodes, like `Number`, simply emit arbitrary numbers.

`Sequencer` also emits arbitrary numbers, but we think about those numbers as having units associated with them - in this case hertz. In reality however, `Sequencer` simply sends numbers alone, just like `Number`.

Some other nodes emit numbers with certain characteristics:

`Sine` node emits numbers in range of -1 to 1. Those numbers signify the position of a speaker cone. We call such signal an _audio_ signal.

`Clock` and `Gate Lenth` emit only numbers zero and one, nothing else. We call such signal a _trigger_ (if it's extremely brief) or _gate_.

One last thing.

Whenver you hover over an input or output of a node, you will see a tooltip with brief info about inputs/outputs type, range and sometimes short description.

Try it out on the nodes you see on the screen.

See you in the next tutorial!
