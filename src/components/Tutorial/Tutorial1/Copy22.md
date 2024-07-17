Now connect output of `AD Envelope` node to parameter (not input!) of `Gain` node that you just created.

This way `AD Envelope` will control loudness of sine oscillator and give it that "guitar-like" pluck sound.

However `AD Envelope` node needs to know _when_ to do that. 

Luckily we already have a perfect source for this kind of information - and that's the `Clock` node. 

So connect output of `Clock` node to input of `AD Envelope` node.
