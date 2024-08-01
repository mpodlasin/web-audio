Now perhaps you are bit susprised. 

It seems that signal from the `Clock` is constantly zero? How is it "a clock" in that case?

Well, if you look _really_ closely perhaps you will see zero displayed on `Value` node flicker from time to time.

This can be more apparent or less apparent depending on the device you are using.

What is happening is that `Clock` changes value, but only for extremely short period of time.

It does it so briefly that `Value` node may have trouble even detecting that consistenly!

And even if it is detected, value changes back to 0 so fast that you can only see a flicker.

There is however a way to fix that. Create `Gate Length` node, found in `Clock` section.
