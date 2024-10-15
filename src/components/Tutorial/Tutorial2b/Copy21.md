It should be now much easier to see what is going on.

Take a look at the `Value` node.

It changes from 0 to 1.

It stays as 1 for quarter of a second.

Then it changes back to 0.

It stays as 0 for three quarters of a second (and thus this whole cycle takes 1 second).

The `Clock` node controls how often the number changes from 0 to 1.

The `Gate Length` node controls how long the number stays as 1. Or in other words how long it takes for it to "jump back" to 0.