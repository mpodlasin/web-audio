Now you can play the melody again.

It probably sounds a bit better. But if you are still not happy with the melody, keep playing with `Sequencer` node knobs until you find something that you like.

Now, even though the melody is nice, the sound itself if still weirdly dry and artificial.

We can quickly fix that, by adding an echo effect, often called _reverb_.

You can do that by using `Convolution` node, to be found in `Effect` section.

Create it and add it between `Sine` and `Gain` nodes.

_(Note that in order to do that, you will first have to remove the line currently connecting `Sine` with `Gain`. Don't be scared to do that while the play button is on, to see how it will affect the sound.)_
