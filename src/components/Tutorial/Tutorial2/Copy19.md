You can now see how number displayed in `Value` node switches regularly to 1 and then switches back to 0.

1 signifies the "tick" of a `Clock` node.

`Clock` node by itself sends a 1 only for extremely short period of time (in milliseconds).

However `Gate Length` allows us to detect that signal and force it have a specific length - in our case 0.2 seconds, which is enough to see it in `Value` node.

Now gradually reduce the tempo parameter on `Clock` node, until it is below 20 BPM.

You will see how number 1 appears less and less frequently.
