We connected `AD Envelope` node to `Gain` node so that `AD Envelope` can control the volume of the sound.

However `AD Envelope` needs to know _when_ to do that.

To stay with our guitar analogy, `AD Envelope` needs to know when to pluck the string of a guitar.

Luckily we already have a perfect source for this kind of information - and that's the `Clock` node.

So connect the output of the `Clock` node to the input of the `AD Envelope` node.
