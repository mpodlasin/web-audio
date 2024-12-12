In general an _envelope_ is a signal that is supposed to represent change of loudness of a sound.

We see however that in `AudioCanvas` an envelope signal is nothing more than stream of numbers, as it is the case with all other signals.

That means that we can - and will! - use `AudioCanvas` envelopes to control other aspects of sound - like tembre or pitch.

In general we will loosely define an envelope signal as a signal in range from 0 to 1.

After all it wouldn't make much sense to control volume with negative values.
