Connect output of `AD Envelope` node to the knob (not input!) of `Gain` node that you just created.

This way `AD Envelope` will control loudness of sine oscillator and give it that "guitar-like" pluck sound.

Now reduce the value of gain parameter itself to 0, just as we did before with frequency parameter of `Sine` oscillator.

That's because when the "pluck" ends, we want it to go completely silent.
