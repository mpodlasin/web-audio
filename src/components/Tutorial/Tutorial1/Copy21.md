We said that we want to control the loudness of the sound (like dimnishing loudness of guitar string).

So we want to control the `Gain` node, which allows us to increase/decrease volume.

But we still want to keep our "global" `Gain` node that controls overall volume coming out of your speakers.

Having that in mind, create *another* `Gain` node and insert it between `Sine` and `Convolution` node.
