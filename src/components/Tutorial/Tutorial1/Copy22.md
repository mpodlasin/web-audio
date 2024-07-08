Now connect output of `AD Envelope` node to gain parameter (not input!) of `Gain` node that you just created.

This way `AD Envelope` will control loudness of sine oscillator and give it that "guitar-like" pluck sound.

However it needs to know _when_ to do that. Luckicly we already have a perfectly fine source of that information - and that's the `Clock` node. This means that on every tick of the `Clock` you will hear the pluck sound.

So connect output of `Clock` node to input of `AD Envelope` node.
