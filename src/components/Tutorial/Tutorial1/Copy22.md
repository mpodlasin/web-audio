We said that we want to control the loudness of the sound (like a dimnishing loudness of a guitar string).

Remember which node was responsible for controlling loudness?

It was the `Gain` node.

But we still want to keep our "main" `Gain` that controls overall volume coming out of your speakers.

Having that in mind, create _another_ `Gain` node and insert it between `Sine` and `Convolution` node.
