Since `Oscilloscope` is not 100% reliable with such short signals, we would like to prolong the tick moment of the `Clock` node.

We would like to have a node that detects the moment the signal from the `Clock` changes from 0 to 1 and then outputs number 1 for as long as we tell it to.

That is precisely what `Gate Length` node is doing. You will find it in the `Clock` section of the node creation menu.

Create `Gate Length` node.
