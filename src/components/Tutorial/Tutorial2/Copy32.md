To summarise, in this tutorial we learned of several different types of signals.

We also learned that all those signals are simply represented as streams of numbers. This is true both for `AudioCanvas` and for computer music in general.

Let's list all of signal types we learnt so far, with examples of related nodes and how they are represented in numbers.


| Signal type   | Nodes                  | Numbers               |
| ------------- | ---------------------- | --------------------- |
| audio         | `Sine`                 | in range -1 to 1      |
| gate, trigger | `Clock`, `Gate Length` | either 0 or 1         |
| envelope      | `AD Enevelope`         | in range 0 to 1       |
