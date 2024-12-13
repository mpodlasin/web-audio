It's probably quite easy to conceptualize what is happening here.

`Number` node emits a number. This number then travels via the line connecting the nodes and ends up displayed by `Value` node.

You may think that a new number is sent only when the value knob on the `Number` node is being moved. However that's not true.

In fact numbers are being constantly transmitted between the nodes right now - even if it's the same number all the time.

Most likely your device processes audio with the frequency of 44100 Hz. This means that every second 44100 numbers are being sent from `Number` to `Value` node!

Let's now use another tool from `Visualization` category - `Oscilloscope` - which will further alow us to see what is going on.

Create `Oscilloscope` and connect `Number` node to it.
