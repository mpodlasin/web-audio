You can now see that the number gradually moves up and down between the values of -1 and 1.

And indeed, that is all the audio signal is!

Perhaps you've seen how spaker cone moves forward and backward when playing sound.

The numbers displayed by `Value` node are representing the position of the cone.

So for example value 0 would mean the cone being at rest position.

1 would signify the cone being protracted forward as much as physically possible.

-1 would signify the cone being retracted backward as much as possible.

_(In reality how far the cone moves would depend also on your operating system settings but we can ingore that for the purposes of the discussion)_

In previous lesson we used `Gain` node to affect the volume of `Sine` oscillator.

Let's check how it will affect the numbers displayed.

Create `Gain` node and insert it between `Sine` and `Value` nodes.
