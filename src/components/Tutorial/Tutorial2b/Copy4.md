It's probably quite easy to conceptualize what is happening here.

`Number` node emits a number. This number then "travels" via the line connecting the nodes and ends up displayed by `Value` node.

You may think that a new number is sent only when the value knob on `Number` node changes. That's not true.

If you have the play button pressed, the numbers are being constantly transmitted between the nodes.

Most likely your device processes audio with the frequency of 44100 Hz.

This means that every second 44100 numbers are being sent from `Number` to `Value` node!

We can further emphasize that by using another tool from `Visualization` category - `Oscilloscope`.

Create `Oscilloscope` and connect `Number` node to it.
