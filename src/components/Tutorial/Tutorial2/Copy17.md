Perhaps you are a bit surprised now.

It seems that signal from the `Clock` is constantly zero.

Well, if you look really closely you may see zero displayed on `Value` node flicker from time to time.

This can be more or less apparent depending on the device you are using.

What is happening is that stream of numbers coming from `Clock` changes value, but only for extremely short period of time.

It does it so briefly that `Value` node may even have trouble detecting that consistenly!

And even if it gets detected, value changes back to 0 so fast that you can only see a flicker, if anything.

There is however a way to fix that. 

Create `Gate Length` node, found in `Clock` section.
