We can now easily see that the signal from the `Clock` has only two possible values: 1 ("on") and 0 ("off").

This type of signal is called either a _trigger_ or _gate_ signal.

Trigger signal usually means very brief jump from 0 to 1 and back, just like `Clock` node by itself does.

Gate signal means similar signal, but just potentially staying longer in its 1 state.

For example if you played a MIDI keyboard and you pressed a keyboard button, we could simulate it with a gate signal, where 0 would mean "not pressed" and 1 would mean "pressed".

So we can think of `Gate Length` node as converting triggers from `Clock` into gates of length specificed with its knob.

Let's make those gates longer.

Start increasing length parameter on `Gate Length` slowly until it is above 2 seconds.

You will see number 1 appearing for longer and longer in `Value` node.
