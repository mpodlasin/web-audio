Now that we have our sequence ready, we would like to somehow "transfer" it from sequencer to frequency knob of `Sine` node.

Note that `Sequencer` node has an output - that's where our sequence will be coming from.

However `Sine` node does not have any inputs - just an output - so how can we control its frequency?

It turns out that nothing stops us from connecting line from `Sequencer` to the frequency knob itself!

Yup, you've read that right. Start dragging a line from `Sequencer` and place it over the frequency knob on the `Sine` node.

Once you let go, you will see the line "snapping" to knob, just as it would to a regular input circle.
