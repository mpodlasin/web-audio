So we see that signal from the `Clock` can have only one of two values - 1 ("on") and 0 ("off").

This type of signal is called either a _trigger_ or _gate_ signal.

Trigger signal usually means very brief jump from 0 to 1 (and back), just like `Clock` node does.

Gate signal means similar signal, but just staying longer in its 1 state.

So we can think of `Gate Length` node as converting triggers from `Clock` into gates of length specificed with the knob.

Start increasing length parameter slowly until it is above 2 seconds.

You will see number 1 appearing for longer and longer in `Value` node.
